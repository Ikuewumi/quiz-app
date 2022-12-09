import { Router, Response } from "express"
import { Et } from "../../config/types.js"
import { Ef } from "../../config/index.js"
import { verify, verifyAdmin } from "../../middleware/auth.js"
import { Quiz } from "../../classes/Quiz.js"
import { DbClass } from "../../config/db.js"
import { QuizTypes, DocumentTypes } from "types"
import { str } from "helpers"
import { AuthClass } from "../../app.js"

const r = Router()

r.use(verify)



//Read operation
r.get('/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      const params = req.params
      const mode = (Ef.query(req, 'mode') ?? 'medium') as QuizTypes.Mode

      let Q = Quiz.genClass(DbClass)

      const result = await Q.getQuiz({ qid: req.params.id ?? '', userDoc: req.userDoc!, drafted: false, mode })
      const userDoc = await AuthClass.getUser(req?.userDoc?.id!)

      Q = null as unknown as Quiz

      return Ef.obj(res, { ...result, userDoc }, 200)
   }
   catch (e) {
      console.trace(e)
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})






r.get('/metadata/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass(DbClass)
      let metadata = await Q.getMeta(req.params.id!, req.userDoc?.id!, (Ef.query(req, 'draft').toLowerCase() === 'true'))
      let authorDoc = await AuthClass.getUser(metadata.aid)
      Q = null as unknown as Quiz
      return Ef.obj(
         res, { quizDoc: metadata, authorDoc: authorDoc }, 200
      )
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})




r.get('/correction/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass(DbClass)
      const metadata = await Q.getCorrection(req.params.id!, req.userDoc?.id!)
      Q = null as unknown as Quiz
      return Ef.obj(res, metadata, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})






r.put('/drafts/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      const draft = req?.body?.draft ?? true
      let Q = Quiz.genClass(DbClass)
      const result = await Q.changeDrafted(req.params.id!, req.userDoc?.id!, draft)
      const authorDoc = await AuthClass.getUser(req.userDoc?.id!)
      Q = null as unknown as Quiz
      return Ef.msg(res, `Quiz has been updated`, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})


r.get('/drafts/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass(DbClass)

      const result = await Q.getQuiz({
         qid: req.params.id ?? '',
         userDoc: req.userDoc!,
         drafted: true
      })

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
      const payload = Quiz.checkQuizTypings(req?.body ?? {})
      let Q = Quiz.genClass(DbClass)
      const result = await Q.save(req.userDoc?.id!, payload.metadata, payload.questions)
      Q = null as unknown as Quiz


      console.log(result)
      return Ef.obj(res, result, 200)
   }
   catch (e) { return Ef.msg(res, e ?? `Something went wrong`, 502) }
})



r.post('/mark/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      const payload = Quiz.checkAnswers(req?.body ?? {})
      let Q = Quiz.genClass(DbClass)
      const result = await Q.markQuiz(payload)
      Q = null as unknown as Quiz


      return Ef.obj(res, result, 200)


   }
   catch (e) { return Ef.msg(res, e ?? `Something went wrong`, 502) }



})



//update operations
//actually update a quiz
r.put('/update/:id', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      const payload = Quiz.checkQuizTypings(req?.body ?? {})
      let Q = Quiz.genClass(DbClass)
      const result = await Q.update(req.params?.id ?? '', req.userDoc?.id!, payload)
      Q = null as unknown as Quiz


      console.log(result)
      return Ef.msg(res, `The quiz has been successfully updated`, 200)
   }
   catch (e) { return Ef.msg(res, e ?? `Something went wrong`, 502) }
})

//get the propeties neccessary for a quiz update
r.get('/update/:id', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      const params = req.params
      let Q = Quiz.genClass(DbClass)
      const result = await Q.getQuizForUpdate(params.id, req.userDoc?.id!)
      Q = null as unknown as Quiz
      return Ef.obj(res, result, 200)
   }
   catch (e) {
      console.trace(e)
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})




//delete operation
r.delete('/:id', verifyAdmin, async (req: Et.Req, res: Et.Res) => {
   try {
      let Q = Quiz.genClass(DbClass)
      const result = await Q.deleteQuiz(req.params.id, req.userDoc?.id!)
      Q = null as unknown as Quiz


      return Ef.msg(res, `The quiz has been successfully deleted`, 200)
   }
   catch (e) { return Ef.msg(res, e ?? `Something went wrong`, 502) }
})



export default r