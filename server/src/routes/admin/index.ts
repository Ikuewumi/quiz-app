import { Router, Response } from "express"
import { Et } from "../../config/types.js"
import { Ef } from "../../config/index.js"
import { verify, verifyAdmin } from "../../middleware/auth.js"
import { AuthClass } from "../../app.js"
import { z } from "zod"
import { DocumentTypes, ZodTypes } from "types"
import { UserListClass } from "../../classes/Admin.js"
import { DbClass } from "../../config/db.js"

const r = Router()

r.use(verify)


r.get('/drafts', verifyAdmin, async (req: Et.Req, res: Et.Res) => {


   try {
      let A = UserListClass.createClass()
      let pageNum = Number(Ef.query(req, 'page'))
      pageNum = (pageNum <= 1) ? 1 : pageNum
      const r = await A.getDraftQuizzes(req.userDoc?.id!, pageNum)
      A = null as unknown as UserListClass
      return Ef.obj(res, r, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }



})


r.get('/quizzes', verifyAdmin, async (req: Et.Req, res: Et.Res) => {


   try {
      let A = UserListClass.createClass()
      let pageNum = Number(Ef.query(req, 'page'))
      pageNum = (pageNum <= 1) ? 1 : pageNum
      const r = await A.getNormalQuizzes(req.userDoc?.id!, pageNum)
      A = null as unknown as UserListClass
      return Ef.obj(res, r, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }



})


r.post('/create', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      const zEmail = z.string().email()
      const email = zEmail.parse(req.body?.email)
      const model = DbClass.getProp<DocumentTypes.User>('user')

      const result = await model.updateOne({ email }, { admin: true })
      if (result.modifiedCount) throw Error('no user with this email present')


      return Ef.msg(res, `A new admin has been created with the email: ${email}`, 200)




   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }


})

r.delete('/user', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      const zEmail = z.string().email()
      const email = zEmail.parse(req.body?.email)
      const model = DbClass.getProp<DocumentTypes.User>('user')

      const result = await model.updateOne({ email }, { admin: true })
      if (result.modifiedCount) throw Error('no user with this email present')


      return Ef.msg(res, `A new admin has been created with the email: ${email}`, 200)




   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }


})





export default r




//Template for other requests 
/*r.get('/:id', async (req: Et.Req, res: Et.Res) => {


   try {
      
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }



})*/