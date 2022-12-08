import { DocumentTypes } from "types"
import { AuthLibrary } from "../classes/Auth.js"
import { DbClass } from "../config/db.js"




export const generateAuthClass = async () => {
   await DbClass.connectToDb()

   const AuthClass = new AuthLibrary({
      keys: {
         access: process.env.ACCESS!,
         refresh: process.env.REFRESH!,
      },
      collections: {
         tokens: DbClass.getProp<DocumentTypes.Token>('token'),
         user: DbClass.getProp<DocumentTypes.User>('user'),
      }
   })

   return AuthClass


}

export const AuthClass = new AuthLibrary({
   keys: {
      access: process.env.ACCESS!,
      refresh: process.env.REFRESH!,
   },
   collections: {
      tokens: DbClass.getProp<DocumentTypes.Token>('token'),
      user: DbClass.getProp<DocumentTypes.User>('user'),
   }
})
