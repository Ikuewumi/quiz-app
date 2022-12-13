import { AuthTypes, DocumentTypes, PropsTypes, UserTypes } from "types"
import { Model, isValidObjectId } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Et } from "../config/types.js"

class RefreshTokensLibrary {
   access: string
   refresh: string

   constructor(keys: AuthTypes.Keys) {
      this.access = keys.access
      this.refresh = keys.refresh
   }

   protected async storeRefreshToken(token: string, coll: Model<DocumentTypes.Token>) {
      const t = new coll({ token })
      const result = await t.save()
      return result
   }

   async removeRefreshToken(token: string, coll: Model<DocumentTypes.Token>) {
      const result = await coll.deleteOne({ token })
      // if (result.deletedCount < 1) throw Error('this token does not exist')
      return result
   }

   async checkForRefreshToken(token: string, coll: Model<DocumentTypes.Token>) {
      const result = await coll.exists({ token })
      if (!isValidObjectId(result?._id)) throw Error('token not found')
      return result
   }
}

class PrivateAuthLibrary extends RefreshTokensLibrary {

   constructor(keys: AuthTypes.Keys) {
      super(keys)
   }

   protected async decodeAccessToken(token: string): Promise<AuthTypes.DecodedToken> {
      return new Promise((resolve, reject) => {
         jwt.verify(token, this.access, (err, data) => {
            if (err) { return reject(String(err)) }
            resolve(data as AuthTypes.DecodedToken)
         })
      })
   }

   protected async decodeRefreshToken(token: string): Promise<AuthTypes.DecodedToken> {
      return new Promise((resolve, reject) => {
         jwt.verify(token, this.refresh, (err, data) => {
            if (err) { return reject(String(err)) }
            resolve(data as AuthTypes.DecodedToken)
         })
      })
   }

   protected async generateAccessToken(user: AuthTypes.DecodedToken, testing = false) {
      const time = testing ? '5s' : '15min'
      const accessToken = await jwt.sign(user, this.access, { expiresIn: time })
      return accessToken
   }

   protected async generateRefreshToken(user: AuthTypes.DecodedToken) {
      const refreshToken = await jwt.sign(user, this.refresh)
      return refreshToken
   }

   public async generateNewTokens(refresh: string, db: Model<DocumentTypes.Token>, test = false): Promise<AuthTypes.Tokens> {
      const tokenInDb = db.exists({ token: refresh })
      if (!tokenInDb) throw Error('invalid credentials')
      const data = await this.decodeRefreshToken(refresh) as AuthTypes.DecodedToken
      const d = { id: data.id, email: data.email }
      const getTokensPromises = [
         this.generateAccessToken(d, test),
         this.generateRefreshToken(d)
      ]
      const [accessToken, refreshToken] = await Promise.all(getTokensPromises)
      await Promise.all([
         this.removeRefreshToken(refresh, db),
         this.storeRefreshToken(refreshToken, db)
      ])
      return {
         accessToken,
         refreshToken
      }


   }

   protected async verifyAccessToken(access: string, usersDb: Model<DocumentTypes.User>) {
      const data = await this.decodeAccessToken(access) as AuthTypes.DecodedToken
      const userInDb = await usersDb.findOne({ id: data.id, email: data.email })
      if (!userInDb) throw Error('invalid credentials')
      if (!isValidObjectId(userInDb?._id)) throw Error('invalid credentials')
      return userInDb

   }

   protected async verifyRefreshToken(refresh: string, usersDb: Model<DocumentTypes.User>, tokenDb: Model<DocumentTypes.Token>) {
      const data = await this.decodeRefreshToken(refresh) as AuthTypes.DecodedToken
      const tokenInDb = await tokenDb.findOne({ token: refresh })
      if (!tokenInDb) throw Error('invalid credentials')
      if (!isValidObjectId(tokenInDb?._id)) throw Error('invalid credentials')
      const userInDb = await usersDb.findOne({ id: data.id, email: data.email })
      if (!userInDb) throw Error('invalid credentials')
      if (!isValidObjectId(userInDb?._id)) throw Error('invalid credentials')
      return userInDb

   }

   public static async hashPassword(pass: string) {
      const hash = await bcrypt.hash(pass, 15)
      return hash
   }

   public static async verifyHash(pass: string, hash: string) {
      const isVerified = await bcrypt.compare(pass, hash)
      return isVerified
   }


   public async getAuthHeader(req: Et.Req) {
      const isPresent =
         req.headers['authorization'] &&
         req.headers['authorization'] > 'Bearer ' &&
         req.headers['authorization'].split(' ')[1] > ''

      if (!isPresent) throw Error('The token is invalid')

      const token = req.headers['authorization']!.split(' ')[1]
      return token

   }

}

export class AuthLibrary extends PrivateAuthLibrary {
   collections: PropsTypes.AuthLibraryConstructors["collections"]

   constructor(props: PropsTypes.AuthLibraryConstructors) {
      super(props.keys)
      this.collections = props.collections
   }

   async signUserUp(user: AuthTypes.SignInUser) {
      //@todo remove console logs and make email check work
      const isValid = await this.collections.user.exists({ email: user.email })
      if (isValid) throw Error('A user with this email is already present')
      const password = await AuthLibrary.hashPassword(user.password)
      const newUser: DocumentTypes.User = {
         name: user.name, email: user.email, password,
         image: "", description: "", admin: false,
         bookmarks: [],
      }
      const u = new this.collections.user(newUser)
      const result = await u.save()
      return result

   }

   async logUserIn(user: AuthTypes.LogInUser, test = false) {
      const dbUser = await this.collections.user.findOne({ email: user.email })
      if (!dbUser) throw Error("invalid credentials")
      if (!isValidObjectId(dbUser?._id)) throw Error('Invalid credentials!')
      const passIsValid = await AuthLibrary.verifyHash(user?.password ?? '', dbUser.password)
      if (!passIsValid) throw Error("invalid credentials")
      const u = { email: dbUser.email, id: dbUser.id }
      const tokensObject = await this.getTokens(u, test)

      return tokensObject
   }

   protected async invalidateToken(token: string) {
      const r = await this.removeRefreshToken(token, this.collections.tokens)
      return r
   }

   async logUserOut(token: string) {
      return this.invalidateToken(token)
   }

   async verifyUser(access: string, admin = false) {
      const userDoc = await this.verifyAccessToken(access, this.collections.user)
      if (admin && userDoc.admin !== true) { throw Error('Forbidden! Invalid Permissions!') }
      return userDoc
   }

   async generateNewToken(refresh: string, admin = false, test = false) {
      const userDoc = await this.verifyRefreshToken(refresh, this.collections.user, this.collections.tokens)
      if (admin && userDoc.admin !== true) { throw Error('Forbidden! Invalid Permissions!') }
      const newTokens = await this.generateNewTokens(refresh, this.collections.tokens, test)
      return newTokens
   }





   protected async getTokens(user: AuthTypes.DecodedToken, test = false): Promise<AuthTypes.Tokens> {
      const [accessToken, refreshToken] = await Promise.all([this.generateAccessToken(user, test), this.generateRefreshToken(user)])
      await this.storeRefreshToken(refreshToken, this.collections.tokens)
      return { accessToken, refreshToken }
   }


   async emailInDb(email: string) {
      const result = await this.collections.user.exists({ email })
      return isValidObjectId(result?._id)
   }



   async getUserMetadata(aid: string, email: string) {
      const userDoc = await this.collections.user.findOne({ _id: aid, email })
      if (!isValidObjectId(userDoc?.id!)) throw Error('user not found')
      if (!userDoc) throw Error('user not found')


      const resultObject = {

         email: userDoc.email,
         name: userDoc.name,
         admin: userDoc?.admin ?? false,
         description: userDoc?.description,
         bookmarks: userDoc.bookmarks,
         image: userDoc.image

      } as UserTypes.UserMetadata


      return resultObject

   }

   async getUser(aid: string, filter: { [index: string]: any } = {}) {
      const userDoc = await this.collections.user.findOne({ _id: aid, ...filter })
      if (!isValidObjectId(userDoc?.id!)) throw Error('user not found')
      if (!userDoc) throw Error('user not found')


      const resultObject = {

         email: userDoc.email,
         name: userDoc.name,
         admin: userDoc?.admin ?? false,
         description: userDoc?.description,
         bookmarks: userDoc.bookmarks,
         image: userDoc.image,
         _id: userDoc.id

      } as UserTypes.UserMetadata


      return resultObject

   }









   async updateUserMetadata(aid: string, email: string, metadata: Metadata) {

      const resultObject: Metadata = {

         name: metadata.name,
         description: metadata?.description,
         image: metadata.image

      }


      const result = await this.collections.user.updateOne(
         { _id: aid, email },
         { $set: resultObject }
      )


      if (!result.modifiedCount) throw Error('user update failed')

      return this.getUserMetadata(aid, email)

   }






   async deleteUser(aid: string, email: string) {

      const result = await this.collections.user.deleteOne({ _id: aid, email })
      if (!result.deletedCount) throw Error('could not delete user')


      return {
         message: `The user with this ${email} has been deleted`
      }


   }












}



interface Metadata {

   name: string;
   description: string;
   image: string;

}