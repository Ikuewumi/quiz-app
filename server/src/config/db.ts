import { DbLibrary } from "../classes/Db.js"
import TestModel from "../models/Test.js"
import UserModel from "../models/User.js"
import TokenModel from "../models/Token.js"
import QuizModel from "../models/Quiz.js"
import QuestionModel from "../models/Question.js"
import AnswerModel from "../models/Answer.js"
import dotenv from "dotenv"
dotenv.config({})

// console.log(process.env.DB_URI)

export const DbClass = new DbLibrary(process.env.DB_URI ?? 'mongodb://127.0.0.1:27017/quiz-app'!, {
   user: UserModel,
   test: TestModel,
   token: TokenModel,
   quiz: QuizModel,
   question: QuestionModel,
   answer: AnswerModel,
})

export const connectDb = async () => DbClass.connectToDb()