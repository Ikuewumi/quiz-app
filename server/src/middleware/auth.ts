import { Et } from "../config/types"
import { Ef } from "../config/index"
import { AuthClass } from "../app"
import { isValidObjectId } from "mongoose"

export const verify: Et.H = async (req: Et.Req, res: Et.Res, next: Et.Next) => {
   try {
      const token = await AuthClass.getAuthHeader(req)
      const isValid = await AuthClass.verifyUser(token)
      if (!isValidObjectId(isValid?.id)) throw Error('invalid credentials')
      next()
   }
   catch (err) {
      return Ef.msg(res, err, 403)
   }
}

export const verifyAdmin: Et.H = async (req: Et.Req, res: Et.Res, next: Et.Next) => {
   try {
      const token = await AuthClass.getAuthHeader(req)
      const isValid = await AuthClass.verifyUser(token, true)
      if (!isValidObjectId(isValid?.id)) throw Error('invalid credentials')
      next()
   }
   catch (err) {
      return Ef.msg(res, err, 403)
   }
}

