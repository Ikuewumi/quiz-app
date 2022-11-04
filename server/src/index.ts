import express, { Express, Request, Response, NextFunction } from "express"

const app = express()
const port = process.env.PORT ?? 5000

app.get('/test', (req: Request, res: Response) => {
   res.json({
      message: "It works!"
   })
})

app.listen(port)