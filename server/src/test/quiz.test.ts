import { beforeAll, describe, expect, it } from "vitest"
import jwt from "jsonwebtoken"
import { sleep } from "helpers"
import bcrypt from "bcrypt"
import { DocumentTypes, QuizTypes } from "types"
import { MdLib } from "md"
import { cq } from "./config"
import shortid from "shortid"
import { Document, Model, ObjectId, Types } from "mongoose"
import { generateAuthClass } from "../config/auth"
import { DbClass } from "../config/db"

class Quiz {
   static async mdToHtml(md: string) { return MdLib.mdToHtml(md) }
   static async htmlToMd(html: string) { return MdLib.htmlToMd(html) }

   constructor(
      public collections: {
         quiz: Model<DocumentTypes.Quiz>,
         questions: Model<DocumentTypes.Question>,
         answers: Model<DocumentTypes.Answer>
      }
   ) { }


   async save(aid: string, metadata: QuizTypes.QuizMetadata, questions: QuizTypes.ClientQuestion[],) {
      const nQuiz: DocumentTypes.Quiz = {
         aid: aid,
         title: metadata.title,
         description: metadata.description,
         tags: metadata.tags,
         image: metadata.image,
         answers: "", questions: ""
      }

      const nQuizDoc = await (new this.collections.quiz(nQuiz)).save()
      const nQuestion: DocumentTypes.Question = { qid: nQuizDoc.id, data: [] }
      const nAnswer: DocumentTypes.Answer = { qid: nQuizDoc.id, data: [] }

      questions.forEach(q => {
         const { question, answer } = this.processQuestion(q, nQuizDoc.id)
         nQuestion.data.push(question)
         nAnswer.data.push(answer)
      })

      console.log(nQuizDoc, nAnswer, nQuestion)

      const nQuestionDoc = new this.collections.questions(nQuestion)
      const nAnswerDoc = new this.collections.questions(nAnswer)

      const newPromises = [nQuestionDoc.save(), nAnswerDoc.save()]
      const promisesResult = await Promise.all(newPromises)

      return [nQuizDoc, ...promisesResult]

   }




   processQuestion(q: QuizTypes.ClientQuestion, qid: string) {
      const sid = Quiz.genId()
      const answer = q.options[q.options.length - 1]

      const pq: QuizTypes.Question = { ...q, sid, options: q.options.sort(_ => Math.random() - 0.5), qid }
      const pa: QuizTypes.Answer = { answer, sid, qid }


      return {
         question: pq,
         answer: pa
      }
   }

   public static genId(): string {
      return shortid.generate()
   }



   async markQuiz() {

   }





}

describe('hello!', () => {
   beforeAll(async () => {
      await DbClass.connectToDb()
   })

   it('give a generate a string', () => {
      const x = Quiz.genId()
      console.log(x)

      expect(x).toHaveProperty("length")
   })

   it('generates a user', async () => {
      const AuthClass = await generateAuthClass()

   })
})