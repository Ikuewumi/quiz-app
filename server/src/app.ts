import dotenv from "dotenv"
dotenv.config({})


import express from "express"
import { AuthLibrary } from "./classes/Auth.js"
import { generateAuthClass } from "./config/auth.js"
import api from "./routes/api.js"
import path from "node:path"
import process from "node:process"
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
      console.log(`🚀 server started at PORT: ${port}`)
   })
}

app.use(cors())

app.use(bodyParser.json({
   limit: "10mb"
}))

app.use('/api', api)

if (process.env.NODE_ENV === 'production') {

   const clientPath = path.resolve(process.cwd(), "client", "dist")
   app.use(express.static(clientPath))
   app.use('*', (req, res) => {
      res.sendFile(path.resolve(clientPath, "index.html"))
   })

} else {

   app.use(morgan('dev'))

}


start()