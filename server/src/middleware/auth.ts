import { Et } from "../config/types.js"
import { Ef } from "../config/index.js"
import { AuthClass } from "../app.js"
import { Document, isValidObjectId } from "mongoose"
import User from "../models/User.js"
import { DocumentTypes } from "types"

export const verify: Et.H = async (req: Et.Req, res: Et.Res, next: Et.Next) => {
   try {
      const token = await AuthClass.getAuthHeader(req)
      const isValid = await AuthClass.verifyUser(token)
      req.userDoc = isValid
      if (!isValidObjectId(isValid?.id)) throw Error('invalid credentials')
      next()
   }
   catch (err) {
      return Ef.msg(res, err, 403)
   }
}




export const verifyWithoutError: Et.H = async (req: Et.Req, res: Et.Res, next: Et.Next) => {
   try {
      const token = await AuthClass.getAuthHeader(req)
      const isValid = await AuthClass.verifyUser(token)
      req.userDoc = isValid
      if (!isValidObjectId(isValid?.id)) { req.userDoc = {} as unknown as DocumentTypes.User }
      next()
   }
   catch (err) {
      req.userDoc = {} as unknown as DocumentTypes.User
      next()
   }
}




export const verifyAdmin: Et.H = async (req: Et.Req, res: Et.Res, next: Et.Next) => {
   try {
      const token = await AuthClass.getAuthHeader(req)
      const isValid = await AuthClass.verifyUser(token, true)
      req.userDoc = isValid
      if (!isValidObjectId(isValid?.id)) throw Error('invalid credentials')
      next()
   }
   catch (err) {
      return Ef.msg(res, err, 403)
   }
}

