import { describe, it, expect, afterAll } from "vitest";
import { connect, Model } from "mongoose"
import UserModel from "../models/User"
import TestModel from "../models/Test"
import { DocumentTypes } from "types"
import { DbClass } from "../config/db"


describe('Starting db...', () => {
   it('connect to db', async () => {
      const conn = await DbClass.connectToDb()
      expect(conn).toBeTruthy()
   })

   it('should get a collection in the db', () => {
      const coll = DbClass.getProp<DocumentTypes.Test>('test')
      expect(coll).toBeTruthy()
   })
})

describe('CRUDing the database', () => {
   const TestCollection = DbClass.getProp<DocumentTypes.Test>('test')
   const testObj = {
      name: 'New name'
   }


   it('create test', async () => {
      const newObject = new TestCollection(testObj)
      const result = await newObject.save()
      console.log(result)



      expect(result).toHaveProperty("id")
   })

   it('read test', async () => {
      const result = await TestCollection.findOne(testObj)
      console.log(result)


      expect(result).toHaveProperty("id")
   })

   it('update test', async () => {
      const result = await TestCollection.updateOne(testObj, {
         name: 'Itachi Uchiha'
      })
      console.log(result)


      expect(result.modifiedCount).toBeGreaterThanOrEqual(1)
   })

   it('delete test', async () => {
      const result = await TestCollection.deleteOne({
         name: 'Itachi Uchiha'
      })
      console.log(result)

      expect(result.deletedCount).toBeGreaterThanOrEqual(1)
   })

   afterAll(async () => {
      const allTests = await TestCollection.find({})
      console.log(allTests)
      await TestCollection.deleteMany({})
   })



})