import { Router, Response } from "express"
import { Et } from "../../config/types.js"
import { Ef } from "../../config/index.js"
import { verify, verifyAdmin, verifyWithoutError } from "../../middleware/auth.js"
import { Quiz } from "../../classes/Quiz.js"
import { DbClass } from "../../config/db.js"
import { QuizTypes, DocumentTypes, UserTypes } from "types"
import { z } from "zod"
import { AuthClass } from "../../app.js"
import { UserListClass } from "../../classes/Admin.js"
import { FilterQuery } from "mongoose"

const r = Router()

r.get('/correction/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass()
      const correction = await Q.getCorrection(req.params.id!)
      Q = null as unknown as Quiz
      return Ef.obj(res, correction, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})


const zUserMetadata = z.object({
   name: z.string().default('Anonymous'),
   email: z.string().default('anon@anon'),
   admin: z.boolean().default(false),
   description: z.string().default(''),
   image: z.string().default(''),
   bookmarks: z.string().array().default([]),
})



r.get('/:id', verifyWithoutError, async (req: Et.Req, res: Et.Res) => {
   try {
      const params = req.params
      const mode = (Ef.query(req, 'mode') ?? 'medium') as QuizTypes.Mode

      let Q = Quiz.genClass()
      let userDoc: UserTypes.UserMetadata

      const result = await Q.quiz(params.id, mode)
      if (req?.userDoc?.id) { userDoc = await AuthClass.getUser(req.userDoc?.id!) }
      else { userDoc = zUserMetadata.strip().parse({}) }

      Q = null as unknown as Quiz

      return Ef.obj(res, { ...result, userDoc }, 200)
   }
   catch (e) {
      console.trace(e)
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})



r.post('/mark/:id', verifyWithoutError, async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass()

      const result = await Q.mark(req.params.id!, req.body)
      let userDoc: UserTypes.UserMetadata

      if (req?.userDoc?.id) {

         let A = UserListClass.createClass()
         const u = await AuthClass.getUser(req.userDoc?.id!)
         await A.saveHistory({
            "data": result.scoreData,
            "title": result.quizDoc.title,
            "aid": result.quizDoc.aid,
            "qid": result.quizDoc?._id!,
            "uid": req?.userDoc?.id!
         })
         A = null as unknown as UserListClass

      }



      Q = null as unknown as Quiz



      return Ef.obj(res, result, 200)


   }
   catch (e) { return Ef.msg(res, e ?? `Something went wrong`, 502) }



})






r.get('/metadata/:id', verifyWithoutError, async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass()
      let isDrafted = (Ef.query(req, 'draft').toLowerCase() === 'true')

      let obj: FilterQuery<DocumentTypes.Quiz> = {}
      obj['drafted'] = isDrafted
      if (isDrafted) { obj['aid'] = req.userDoc?.id }


      let metadata = await Q.readMetadata(req.params.id!, obj)
      let authorDoc = await AuthClass.getUser(metadata.aid)


      if (isDrafted && !!!(authorDoc.admin)) {
         throw Error('oops!. you cannot view a drafted quiz if you are not the author')
      }


      Q = null as unknown as Quiz
      return Ef.obj(
         res, { quizDoc: metadata, authorDoc: authorDoc }, 200
      )
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})





r.use(verify)



//Read operation


















r.put('/drafts/:id', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      const draft = req?.body?.draft ?? true

      let Q = Quiz.genClass()
      const result = await Q.changeDraftStatus(req.params.id!, req.userDoc?.id!, draft)
      Q = null as unknown as Quiz

      return Ef.msg(res, result, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})


r.get('/drafts/:id', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass()

      const result = await Q.adminRead(req.params.id!, req.userDoc!)
      const authorDoc = await AuthClass.getUser(req.userDoc?.id!)


      Q = null as unknown as Quiz

      return Ef.obj(res, { ...result, authorDoc }, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})








//create operation
r.post('/create', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass()
      const result = await Q.create(req.body, req.userDoc?.id!)
      Q = null as unknown as Quiz


      return Ef.obj(res, result, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})







//update operations
r.put('/update/:id', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass()
      const result = await Q.update(req.body, req.userDoc?.id!, req.params?.id!,)
      Q = null as unknown as Quiz

      return Ef.msg(res, result, 200)
   }
   catch (e) { return Ef.msg(res, e ?? `Something went wrong`, 502) }
})




//delete operation
r.delete('/:id', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass()
      const result = await Q.remove(req.params.id, req.userDoc?.id!)
      Q = null as unknown as Quiz


      return Ef.msg(res, result, 200)
   }
   catch (e) { return Ef.msg(res, e ?? `Something went wrong`, 502) }
})



export default r