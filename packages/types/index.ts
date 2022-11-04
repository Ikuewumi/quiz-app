import { Model } from "mongoose"

export namespace DocumentTypes {
   export interface User extends Types.TimeData, AuthTypes.BasicUser {
      name: string
      admin: boolean
      description: string
      image: string
      bookmarks: Array<string>

   }


   export interface Token extends Types.TimeData {
      token: string
   }

   export interface Test extends Types.TimeData {
      name: string
   }
}


export namespace AuthTypes {
   export interface BasicUser {
      email: string,
      password: string
   }

   export interface SignInUser extends AuthTypes.BasicUser {
      name: string
   }

   export interface LogInUser extends AuthTypes.BasicUser { }


   export type Keys = {
      access: string,
      refresh: string
   }

   export type Tokens = {
      accessToken: string,
      refreshToken: string
   }

   export type DecodedToken = {
      id: string,
      email: string
   }


}

export namespace PropsTypes {

   export interface AuthLibraryConstructors {
      keys: AuthTypes.Keys,
      collections: {
         user: Model<DocumentTypes.User>,
         tokens: Model<DocumentTypes.Token>
      }
   }


}


export namespace Types {


   export interface TimeData {
      createdAt?: string
      updatedAt?: string
   }


}
