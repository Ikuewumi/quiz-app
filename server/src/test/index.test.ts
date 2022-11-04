import { describe, expect, it } from "vitest"
import jwt from "jsonwebtoken"
import { sleep } from "helpers"
import bcrypt from "bcrypt"
import { AuthTypes } from "types"

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

   constructor(keys: Keys) {
      this.access = keys.access
      this.refresh = keys.refresh
   }

   async storeRefreshToken() { }
}

class PrivateAuthLibrary extends RefreshTokensLibrary {

   constructor(keys: Keys) {
      super(keys)
   }


   protected async generateAccessToken(user: AuthTypes.SignInUser) {
      const accessToken = await jwt.sign(user, this.access, { expiresIn: '5s' })
      return accessToken
   }

   protected async generateRefreshToken(user: AuthTypes.SignInUser) {
      const refreshToken = await jwt.sign(user, this.refresh)
      return refreshToken
   }

   public static async hashPassword(pass: string) {
      const hash = await bcrypt.hash(pass, 15)
      return hash
   }


}



export class AuthLibrary extends PrivateAuthLibrary {

   constructor(keys: Keys) {
      super(keys)
   }


   async getTokens(user: AuthTypes.SignInUser): Promise<Tokens> {
      const [accessToken, refreshToken] = await Promise.all(
         [
            this.generateAccessToken(user),
            this.generateRefreshToken(user)
         ]
      )

      return {
         accessToken,
         refreshToken
      }
   }

   async verifyAccessToken(token: string) {
      return new Promise((resolve, reject) => {
         jwt.verify(token, this.access, (err, data) => {
            if (err) { return reject(String(err)) }
            console.log('data is:', data)
            resolve(data)
         })
      })
   }





   async removeRefreshToken() {

   }

}



describe('simple test', () => {
   it('should work', () => {
      expect(Math.sqrt(4)).toEqual(2)
   })
})


// GLobal dummy user variables
export const d: AuthTypes.SignInUser = {
   name: "Itachi Uchiha",
   email: 'a@b.c',
   password: '1234567'
}



describe('authorization suite - access and refresh tokens', async () => {
   let tokens: Tokens
   const AuthClass = new AuthLibrary({
      access: process.env.ACCESS!,
      refresh: process.env.REFRESH!,
   })



   it('should generate an access and refresh token', async () => {

      tokens = await AuthClass.getTokens(d)

      console.log(tokens)

      expect(tokens).toHaveProperty('accessToken')
      expect(tokens).toHaveProperty('refreshToken')

   })




   it('should be able to verify a particular token', async () => {
      const data = await AuthClass.verifyAccessToken(tokens.accessToken)

      expect(data).toHaveProperty('iat')
   })



   it.fails('should fail verfification after the timelimit has been exceeded', async () => {
      await sleep(5000)
      const data = await AuthClass.verifyAccessToken(tokens.accessToken)

      expect(data).toHaveProperty('iat')
   }, 5500)
})