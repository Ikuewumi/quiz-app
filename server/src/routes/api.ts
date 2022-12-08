import auth from "./auth/index.js"
import quiz from './quiz/index.js'
import user from "./user/index.js"
import admin from "./admin/index.js"
import lists from "./lists/index.js"
import { Router } from "express"
import { Et } from "../config/types.js"
import { Ef } from "../config/index.js"

const r = Router()

r.use('/auth', auth)
r.use('/quiz', quiz)
r.use('/user', user)
r.use('/admin', admin)
r.use('/lists', lists)

export default r




//Template for other requests 
/*r.get('/:id', async (req: Et.Req, res: Et.Res) => {


   try {
      
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }



})*/