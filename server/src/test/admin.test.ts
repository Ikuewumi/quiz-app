import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { DocumentTypes, QuizTypes } from "types"
import { cq, quizMock_ } from "./config/index.js"
import { DbClass } from "../config/db.js"
import { UserListClass } from "../classes/Admin.js"


describe('admin user suite with pagination', () => {
   let A: UserListClass;

   beforeAll(async () => {
      await DbClass.connectToDb()
      A = await UserListClass.createClass()
   })


   it('should get all quizzes', async () => {
      console.log(A)
      const r = await A.getDraftQuizzes(quizMock_.aid)
      expect(r.count).toBeTypeOf('number')
      expect(r.page).toBeTypeOf('number')
      expect(r.maxPageCount).toBeTypeOf('number')
      expect(r.pageCount).toBeTypeOf('number')
      expect(r.data).toHaveProperty('length')
      console.log(r)
   })

})