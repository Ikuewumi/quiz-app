import { DbLibrary } from "../classes/Db.js"
import UserModel from "../models/User.js"
import TokenModel from "../models/Token.js"
import QuizModel from "../models/Quiz.js"

import HistoryModel from "../models/History.js"
import TagModel from "../models/Tag.js"
import dotenv from "dotenv"
dotenv.config({})


export const DbClass = new DbLibrary(process.env.DB_URI!, {
   user: UserModel,

   token: TokenModel,
   quiz: QuizModel,

   history: HistoryModel,
   tag: TagModel
})

export const connectDb = async () => DbClass.connectToDb()