import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { AuthTypes, DocumentTypes } from "types"
import { DbClass } from "./db.test.js";
import { d, AuthLibrary } from "./index.test.js"
import { Model } from "mongoose";

async function signUp(user: AuthTypes.SignInUser, UserModel: Model<DocumentTypes.User>) {

   const password = await AuthLibrary.hashPassword(user.password)
   const newUser: DocumentTypes.User = {
      name: user.name, email: user.email, password,
      image: "", description: "", admin: false,
      bookmarks: [],
   }

   const u = new UserModel(newUser)
   const result = await u.save()

   return result

}



describe('Walkthrough of a User', () => {
   beforeAll(() => async () => await DbClass.connectToDb())


   it('signs up a user', async () => {
      const UserModel = DbClass.getProp<DocumentTypes.User>('user')
      const result = await signUp(d, UserModel)

      expect(result).toHaveProperty("_id")
      expect(result).toHaveProperty("name")
   })


})