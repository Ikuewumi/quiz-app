import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { DocumentTypes, QuizTypes } from "types"
import { cq, quizMock_ } from "./config/index.js"
import { DbClass } from "../config/db.js"
import { Quiz } from "../classes/Quiz.js"

describe('checking typings suite', () => {
   it('check typings', () => {

      const result = Quiz.checkQuizTypings({
         metadata: {
            title: "",
            description: "",
            image: "",
            tags: [""]
         },
         questions: [
            {
               q: "",
               options: ["", ""]
            }
         ]
      })

      console.log(result)


   })

   it.fails('check typings should fail', () => {

      const result = Quiz.checkQuizTypings({
         metadata: {
            title: 20 as unknown as string,
            description: "",
            image: "",
            tags: [""]
         },
         questions: [
            {
               q: "",
               options: ["", ""]
            }
         ]
      })

      console.log(result)


   })

   it.fails('check typings should fail', () => {

      const result = Quiz.checkQuizTypings({} as unknown as any)
      console.log(result)


   })

   it.fails('check typings should fail', () => {

      const result = Quiz.checkQuizTypings(null as unknown as any)
      console.log(result)


   })


})

describe('hello!', () => {
   let Q: Quiz;
   let gQuizId: string, gAnswerId: string, gQuestionId: string;

   beforeAll(async () => {
      await DbClass.connectToDb()
      Q = new Quiz({
         "answers": DbClass.getProp<DocumentTypes.Answer>('answer'),
         "questions": DbClass.getProp<DocumentTypes.Question>('question'),
         "quiz": DbClass.getProp<DocumentTypes.Quiz>('quiz')
      })
   })

   it('give a generate a string', () => {
      const x = Quiz.genId()
      console.log(x)

      expect(x).toHaveProperty("length")
   })


   it('should create a quiz', async () => {
      const result = await Q.save(quizMock_.aid, quizMock_.metadata, quizMock_.questions)
      console.log(result)

      const [quizId, questionId, answerId] = result.map(r => r?.id!)
      gAnswerId = answerId;
      gQuizId = quizId;
      gQuestionId = questionId;

      console.log(quizId, questionId, answerId)

      const answer = result[2] as unknown as DocumentTypes.Answer

      const answerData = {
         qid: answer.qid,
         data: answer.data
      } as QuizTypes.ClientAnswer
      console.log(answerData)

      const markResult = await Q.markQuiz(answerData)

      console.log(markResult)
   })

   it('should get a quiz made for a user', async () => {
      const result = await Q.getQuizForClient(gQuizId, "easy", {} as unknown as any)
      console.log(result)
   })

   it('get a quiz for update action', async () => {
      const result = await Q.getQuizForUpdate(gQuizId, quizMock_.aid)
      expect(result?.quizDoc).toHaveProperty('id')
      expect(result?.quizDoc).toHaveProperty('title')
      expect(result?.quizDoc).toHaveProperty('description')
      expect(result?.quizDoc).toHaveProperty('answers')
      expect(result?.quizDoc).toHaveProperty('questions')
      expect(result?.quizDoc).toHaveProperty('image')
      expect(result?.quizDoc).toHaveProperty('tags')
      console.log(result)
   })

   it('update quiz', async () => {
      const q = await Q.getQuizForUpdate(gQuizId, quizMock_.aid)
      const updated = {
         metadata: {
            ...quizMock_.metadata,
            title: "Dark Paradise",
            showCorrection: true
         } as unknown as QuizTypes.QuizMetadata,

         questions: quizMock_.updateQuestions
      }
      console.log(q)
      const result = await Q.update(gQuizId, quizMock_.aid, updated)
      console.log(result)
   })

   it('should get a updated quiz', async () => {
      const result = await Q.getQuizForClient(gQuizId, "easy", {} as unknown as any)
      console.log('updated', result)

      const t = result.metadata.title
      expect(t).toBe('Dark Paradise')
   })


   it('get corrections for a quiz', async () => {

      const result = await Q.getCorrection(gQuizId, quizMock_.aid)
      console.log(result.questions.data)
      console.log(result)

   })


   it('deletes a quiz', async () => {
      const result = await Q.deleteQuiz(gQuizId, quizMock_.aid)
      console.log(result)
   })


   it.fails('to get a deleted quiz', async () => {
      const result = await Q.getQuizForClient(gQuizId, "easy", {} as unknown as any)
      console.log(result)
   })


   afterAll(async () => {
      //delete questions, answers and quizzes all related to the mock
      await Q.collections.quiz.deleteMany({ title: quizMock_.metadata.title })
      await Q.collections.quiz.deleteMany({ title: "Dark Paradise" })
      await Q.collections.answers.deleteOne({ _id: gAnswerId })
      await Q.collections.questions.deleteOne({ _id: gQuestionId })
   })
})