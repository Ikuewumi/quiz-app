import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { AuthTypes, DocumentTypes } from "types"
import { sleep } from "helpers"
import { generateAuthClass } from "../config/auth.js";
import { DbClass } from "../config/db.js"
import { d } from "./config/index.js";
import { AuthLibrary } from "../classes/Auth.js"
import { Model } from "mongoose";




describe('Walkthrough of a User', () => {
   let AuthClass: AuthLibrary;
   let tokens: AuthTypes.Tokens;
   let isTesting = true



   beforeAll(async () => {
      AuthClass = await generateAuthClass()
      const result = await AuthClass.collections.user.deleteMany({ email: d.email })
      console.log(result)
   })




   it('should get a collection in the db', () => {
      const coll = DbClass.getProp<DocumentTypes.User>('user')
      expect(coll).toBeTruthy()
   })




   it('should get all users present', async () => {
      const result = await DbClass.getProp<DocumentTypes.User>('user').find({})
      console.log(result)
      expect(result).toHaveProperty('length')
   })




   it('signs up a user', async () => {
      const result = await AuthClass.signUserUp(d)
      console.log(result)
      expect(result).toBeTruthy()
   })




   it.fails('logs a user in with incorrect credentials', async () => {
      tokens = await AuthClass.logUserIn({
         email: d.email,
         password: '123456.7'
      }, isTesting)
      console.log(tokens)

      expect(tokens).toHaveProperty("accessToken")
      expect(tokens).toHaveProperty("refreshToken")
   })




   it('logs a user in', async () => {
      tokens = await AuthClass.logUserIn({
         email: d.email,
         password: d.password
      }, isTesting)
      console.log(tokens)

      expect(tokens).toHaveProperty("accessToken")
      expect(tokens).toHaveProperty("refreshToken")
   })





   it('verifies a user with their access token', async () => {
      const v = await AuthClass.verifyUser(tokens.accessToken)
      console.log(v)


      expect(v).toHaveProperty("id")
      expect(v).toHaveProperty("email")


   })


   it.fails('verifies a user with their access token after expiry', async () => {
      await sleep(5000)
      const v = await AuthClass.verifyUser(tokens.accessToken)
      console.log(v)

      expect(v).toHaveProperty("id")
      expect(v).toHaveProperty("email")


   })




   it('generate a new access token with refresh token', async () => {
      tokens = await AuthClass.generateNewToken(tokens.refreshToken, false, isTesting)
      console.log(tokens)


      expect(tokens.accessToken).toBeTruthy()
   })





   it('verifies a user with their new access token', async () => {
      const v = await AuthClass.verifyUser(tokens.accessToken)
      console.log(v)

      expect(v).toHaveProperty("id")
      expect(v).toHaveProperty("email")


   })



   it('removes a refresh token from db', async () => {
      const r = await AuthClass.logUserOut(tokens.refreshToken)
      console.log(r)

      expect(r).toHaveProperty("deletedCount")
      expect(r.deletedCount).toBeGreaterThanOrEqual(1)

   })


   it.fails('should fail to generate a new access token with invalid refresh token', async () => {
      tokens = await AuthClass.generateNewToken(tokens.refreshToken, false, isTesting)
      console.log(tokens)

      expect(tokens.accessToken).toBeTruthy()
   })




   afterAll(async () => {
      const result = await AuthClass.collections.user.deleteMany({ email: d.email })
      console.log(result)
   })

})