import { Router, Response } from "express"
import { Et } from "../../config/types.js"
import { Ef } from "../../config/index.js"
import { verify } from "../../middleware/auth.js"
import { AuthClass } from "../../app.js"
import { z } from "zod"
import { ZodTypes } from "types"
import { UserListClass } from "../../classes/Admin.js"

const r = Router()

r.use(verify)

r.get('/metadata/:id', async (req: Et.Req, res: Et.Res) => {
   try {
      const result = await AuthClass.getUser(req.params.id!)
      return Ef.obj(
         res,
         { _id: req.params.id!, ...result },
         200
      )
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})


r.get('/metadata', async (req: Et.Req, res: Et.Res) => {
   try {
      const result = await AuthClass.getUserMetadata(req.userDoc?.id!, req.userDoc?.email!)
      return Ef.obj(
         res,
         { _id: req.userDoc?.id, ...result },
         200
      )
   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }
})


r.patch('/metadata', async (req: Et.Req, res: Et.Res) => {
   try {
      const requestBody = ZodTypes.zUserMetadata.parse(req.body ?? {})
      const result = await AuthClass.updateUserMetadata(
         req.userDoc?.id!,
         req.userDoc?.email!,
         requestBody,
      )

      return Ef.obj(res, result, 200)

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