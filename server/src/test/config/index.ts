import { describe, it, expect, afterAll } from "vitest";
import { connect, Model, Types, isValidObjectId } from "mongoose"
import { AuthTypes, DocumentTypes, PropsTypes } from "types";
import { sleep } from "helpers"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import UserModel from "../../models/User.js"
import TestModel from "../../models/Test.js"

type DbModelsObject = {
   [index: string]: Model<any>
}

class DbLibrary {

   constructor(
      readonly url: string,
      private props: DbModelsObject
   ) { }

   async connectToDb() {
      return connect(this.url)
   }

   getProp<T>(key: string): Model<T> {
      const isPresent = key in this.props
      if (!isPresent) throw Error('this db was not registered')
      return this.props[key]
   }

}


type Keys = {
   access: string,
   refresh: string
}

type Tokens = {
   accessToken: string,
   refreshToken: string
}


class RefreshTokensLibrary {
   access: string
   refresh: string

   constructor(keys: AuthTypes.Keys) {
      this.access = keys.access
      this.refresh = keys.refresh
   }

   async storeRefreshToken(token: string, coll: Model<DocumentTypes.Token>) {
      const t = new coll({ token })
      const result = await t.save()
      return result
   }

   async removeRefreshToken(token: string, coll: Model<DocumentTypes.Token>) {
      const result = await coll.deleteOne({ token })
      if (result.deletedCount < 1) throw Error('this token does not exist')
      return result
   }

   async checkForRefreshToken(token: string, coll: Model<DocumentTypes.Token>) {
      const result = await coll.exists({ token })
      if (!isValidObjectId(result?._id)) throw Error('token not found')
      return result
   }
}

class PrivateAuthLibrary extends RefreshTokensLibrary {

   constructor(keys: Keys) {
      super(keys)
   }

   protected async decodeAccessToken(token: string) {
      return new Promise((resolve, reject) => {
         jwt.verify(token, this.access, (err, data) => {
            if (err) { return reject(String(err)) }
            console.log('data is:', data)
            resolve(data)
         })
      })
   }

   protected async decodeRefreshToken(token: string) {
      return new Promise((resolve, reject) => {
         jwt.verify(token, this.refresh, (err, data) => {
            if (err) { return reject(String(err)) }
            console.log('data is:', data)
            resolve(data)
         })
      })
   }


   protected async generateAccessToken(user: { id: string, email: string }) {
      const accessToken = await jwt.sign(user, this.access, { expiresIn: '5s' })
      return accessToken
   }

   protected async generateRefreshToken(user: { id: string, email: string }) {
      const refreshToken = await jwt.sign(user, this.refresh)
      return refreshToken
   }

   protected async generateNewAccessToken(refresh: string, db: Model<DocumentTypes.Token>) {
      const tokenInDb = db.exists({ token: refresh })
      if (!tokenInDb) throw Error('invalid credentials')
      const data = await this.decodeRefreshToken(refresh)


   }

   public static async hashPassword(pass: string) {
      const hash = await bcrypt.hash(pass, 15)
      return hash
   }


}

class AuthLibrary extends PrivateAuthLibrary {
   collections: PropsTypes.AuthLibraryConstructors["collections"]

   constructor(props: PropsTypes.AuthLibraryConstructors) {
      super(props.keys)
      this.collections = props.collections
   }

   async signUserUp(user: AuthTypes.SignInUser) {

      const isValid = await this.emailInDb(user.email)
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

   async logUserIn(user: AuthTypes.LogInUser) {
      const dbUser = await this.collections.user.findOne({ email: user.email })
      if (!dbUser) throw Error("invalid credentials")
      if (!isValidObjectId(dbUser?._id)) throw Error('Invalid credentials!')
      const u = { email: dbUser.email, id: dbUser.id }
      const tokensObject = await this.getTokens(u)

      return tokensObject
   }





   async getTokens(user: { id: string, email: string }): Promise<Tokens> {
      const [accessToken, refreshToken] = await Promise.all([this.generateAccessToken(user), this.generateRefreshToken(user)])
      await this.storeRefreshToken(refreshToken, this.collections.tokens)
      return { accessToken, refreshToken }
   }


   async emailInDb(email: string) {
      const result = await this.collections.user.exists({ email })
      return isValidObjectId(result?._id)
   }

}