import dotenv from "dotenv"
dotenv.config({})

// console.log(process.env)

import express from "express"
import { AuthLibrary } from "./classes/Auth.js"
import { Et } from "./config/types.js"
import { Ef } from "./config/index.js"
import { generateAuthClass } from "./config/auth.js"
import { verify } from "./middleware/auth.js"
import api from "./routes/api.js"
import path from "path"
import cors from "cors"
/**@ts-ignore */
import bodyParser from "body-parser"
/**@ts-ignore */
import morgan from "morgan"
export let AuthClass: AuthLibrary


const app = express()
const port = process.env.PORT ?? 5000
const start = async () => {
   AuthClass = await generateAuthClass()
   app.listen(port, () => {
      console.log(`🚀 server started at http://localhost:${port}`)
   })
}

app.use(cors())

app.use(bodyParser.json({
   limit: "10mb"
}))

if (process.env.NODE_ENV !== 'production') {
   app.use(morgan('dev'))
}

app.get('/test', (req: Et.Req, res: Et.Res) => Ef.msg(res, 'works! normal data'))

app.get('/protected', verify, (req: Et.Req, res: Et.Res) => Ef.msg(res, 'works! protected data'))

app.use('/api', api)


start()