import { Router, Response } from "express"
import { Et } from "../../config/types.js"
import { Ef } from "../../config/index.js"
import { UserListClass } from "../../classes/Admin.js"
import { verify } from "../../middleware/auth.js"
import { Tag } from "../../classes/Tag.js"

const r = Router()



r.get('/tags', async (req: Et.Req, res: Et.Res) => {


   try {
      let T = Tag.createClass()
      const tags = await T.getTags()
      T = null as unknown as Tag

      return Ef.obj(res, { tags }, 200)



   }
   catch (e) {
      return Ef.msg(res, e ?? `Something went wrong`, 502)
   }



})





export default r