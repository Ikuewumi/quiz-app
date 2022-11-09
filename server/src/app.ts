import dotenv from "dotenv"
dotenv.config({})

import express from "express"
import { AuthLibrary } from "./classes/Auth"
import { Et } from "./config/types"
import { Ef } from "./config/index"
import { generateAuthClass } from "./config/auth"
import { verify } from "./middleware/auth"
import api from "./routes/api"
import path from "path"
export let AuthClass: AuthLibrary


const app = express()
const port = process.env.PORT ?? 5000
const start = async () => {
   AuthClass = await generateAuthClass()
   app.listen(port, () => {
      console.log(`🚀 server started at http://localhost:${port}`)
   })
}

app.use(express.json())

app.get('/test', (req: Et.Req, res: Et.Res) => Ef.msg(res, 'works! normal data'))

app.get('/protected', verify, (req: Et.Req, res: Et.Res) => Ef.msg(res, 'works! protected data'))

app.use('/api', api)


start()