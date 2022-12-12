import { Router, Response } from "express"
import { Et } from "../../config/types.js"
import { Ef } from "../../config/index.js"
import { UserListClass } from "../../classes/Admin.js"
import { verify } from "../../middleware/auth.js"

const r = Router()

// r.use(verify)


r.get('/home', async (req: Et.Req, res: Et.Res) => {


   try {
      UserListClass.pageLimit = 10

      let A = await UserListClass.createClass()
      let pageNum = Number(Ef.query(req, 'page'))
      pageNum = (pageNum <= 1) ? 1 : pageNum
      const r = await A.getQuizList({
         filters: { drafted: false },
         page: pageNum,
         sort: { updatedAt: -1 },
         select: UserListClass.getSelects(UserListClass.selectFields.quiz)
      })

      UserListClass.pageLimit = 20
      A = null as unknown as UserListClass
      return Ef.obj(res, r, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }



})

r.get('/quizzes', async (req: Et.Req, res: Et.Res) => {


   try {
      let A = await UserListClass.createClass()
      let pageNum = Number(Ef.query(req, 'page'))
      pageNum = (pageNum <= 1) ? 1 : pageNum
      const r = await A.getQuizList({
         filters: { drafted: false },
         page: pageNum,
         sort: { title: 1 },
         select: UserListClass.getSelects(UserListClass.selectFields.quiz)
      })

      UserListClass.pageLimit = 20
      A = null as unknown as UserListClass
      return Ef.obj(res, r, 200)
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }



})










r.get('/history', verify, async (req: Et.Req, res: Et.Res) => {


   try {
      let A = UserListClass.createClass()
      let pageNum = Number(Ef.query(req, 'page'))
      pageNum = (pageNum <= 1) ? 1 : pageNum
      const r = await A.getHistory(req?.userDoc?.id!, pageNum)
      A = null as unknown as UserListClass
      return Ef.obj(res, r, 200)
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