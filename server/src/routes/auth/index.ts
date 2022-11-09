import { Router, Response } from "express"
import { Et } from "../../config/types"
import { Ef } from "../../config/index"
import { AuthClass } from "../../app"

const r = Router()

r.post('/signup', async (req: Et.Req, res: Et.Res) => {
   try {
      console.log(req.body)
      const { name, email, password } = req.body
      if (!(name && email && password)) throw Error('invalid credentials!. payload must contain name, email and password')
      const userDoc = await AuthClass.signUserUp({ name, email, password })
      const msg = `Congrats ${userDoc.name}, you have been registered!`
      return Ef.msg(res, msg)
   }
   catch (err) { return Ef.msg(res, err, 503) }
})



r.post('/login', async (req: Et.Req, res: Et.Res) => {
   try {
      const { email, password } = req.body
      if (!(email && password)) throw Error('invalid credentials!. payload must contain email and password')
      const tokens = await AuthClass.logUserIn({ email, password })
      return Ef.obj(res, tokens)
   }
   catch (err) { return Ef.msg(res, err, 503) }
})



r.post('/logout', async (req: Et.Req, res: Et.Res) => {
   try {
      const token = await AuthClass.getAuthHeader(req)
      await AuthClass.logUserOut(token)
      const msg = `You are now logged out`
      return Ef.msg(res, msg, 202)
   }
   catch (err) { return Ef.msg(res, err, 503) }
})



r.post('/authorize', async (req: Et.Req, res: Et.Res) => {
   try {
      const { refreshToken } = req.body
      const tokens = await AuthClass.generateNewToken(refreshToken)
      return Ef.obj(res, tokens, 200)
   }
   catch (err) { return Ef.msg(res, err, 503) }
})

export default r