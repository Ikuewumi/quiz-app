import { MdLib } from 'md'
import { Model, isValidObjectId, Document, Types, FilterQuery } from "mongoose"
import { QuizTypes, DocumentTypes } from 'types'
import { arr, str } from "helpers"
import shortid from 'shortid'
import { DbLibrary } from './Db.js'



export class Quiz {
   static async mdToHtml(md: string) { return MdLib.mdToHtml(md) }
   static async htmlToMd(html: string) { return MdLib.htmlToMd(html) }

   static checkQuizTypings(payload: {
      metadata: QuizTypes.QuizMetadata,
      questions: QuizTypes.ClientQuestion[]
   }) {
      try {
         const metaisValid = str(payload?.metadata?.description, payload?.metadata?.title, payload?.metadata?.image, ...payload?.metadata?.tags) as boolean
         const questionsAreValid = payload?.questions.map(q => str(q?.q, q?.info ?? '', q?.image ?? '', ...q?.options) as boolean).reduce((acc, curr) => !!(acc && curr), true)

         if (!(metaisValid && questionsAreValid)) throw Error('')

         return {
            metadata: payload.metadata,
            questions: payload.questions
         }
      } catch (e) {
         throw Error('typings are incorrect')
      }
   }

   static checkAnswers(payload: DocumentTypes.Answer) {
      const metaisValid = str(payload?.qid) as boolean
      const checkAnswer = (payload: QuizTypes.Answer) => str(payload?.answer, payload?.qid, payload?.sid)
      const answersAreValid = arr(payload?.data) && payload?.data.reduce((acc, curr) => {
         return !!(acc && checkAnswer(curr))
      }, true)

      if (!(metaisValid && answersAreValid)) throw Error('whoops! the answer is invalid')


      return {
         qid: payload.qid,
         data: payload.data
      }

   }


   static genClass(DbClass: DbLibrary) {
      const r = new Quiz({
         answers: DbClass.getProp<DocumentTypes.Answer>('answer'),
         questions: DbClass.getProp<DocumentTypes.Question>('question'),
         quiz: DbClass.getProp<DocumentTypes.Quiz>('quiz')
      })

      return r
   }

   constructor(
      public collections: {
         quiz: Model<DocumentTypes.Quiz>,
         questions: Model<DocumentTypes.Question>,
         answers: Model<DocumentTypes.Answer>
      }
   ) { }


   async save(aid: string, metadata: QuizTypes.QuizMetadata, questions: QuizTypes.ClientQuestion[],) {

      const qD = await this.collections.quiz.exists({ title: metadata.title })

      if (qD) throw Error('please use another title. this one has been taken')


      const nQuiz: DocumentTypes.Quiz = {
         aid: aid,
         title: metadata.title,
         description: metadata.description,
         tags: metadata.tags,
         image: metadata.image,
         answers: "", questions: "",
         bookmarks: 0, drafted: true,
         showCorrection: metadata.showCorrection ?? false
      }

      const nQuizDoc = await (new this.collections.quiz(nQuiz)).save()
      const nQuestion: DocumentTypes.Question = { qid: nQuizDoc.id, data: [] }
      const nAnswer: DocumentTypes.Answer = { qid: nQuizDoc.id, data: [] }

      questions.forEach(q => {
         const { question, answer } = this.processQuestion(q, nQuizDoc.id)
         nQuestion.data.push(question)
         nAnswer.data.push(answer)
      })

      // console.log(nQuizDoc, nAnswer, nQuestion)

      const nQuestionDoc = new this.collections.questions(nQuestion)
      const nAnswerDoc = new this.collections.answers(nAnswer)

      const newPromises = [nQuestionDoc.save(), nAnswerDoc.save()]
      const promisesResult = await Promise.all(newPromises)

      await this.collections.quiz.updateOne(
         { _id: nQuizDoc.id },
         { questions: promisesResult[0].id, answers: promisesResult[1].id, }
      )

      const qDoc = await this.collections.quiz.findOne({ _id: nQuizDoc.id })

      return [qDoc, ...promisesResult]

   }



   async changeBookmark(qid: string, aid: string, increase = true) {
      const a = increase ? 1 : -1
      const result = await this.collections.quiz.updateOne(
         { _id: qid },
         { $inc: { bookmarks: a } }
      )

      if (!result.modifiedCount) throw Error('could not bookmark')

      return result
   }

   async changeDrafted(qid: string, aid: string, draft = true) {
      const a = Boolean(draft)
      const result = await this.collections.quiz.updateOne(
         { _id: qid, aid },
         { $set: { drafted: a } }
      )


      if (!result.modifiedCount) throw Error('could not bookmark')

      return result
   }


   async getMetadata(qid: string, aid: string) {

      const metadata = await this.collections.quiz.findOne({ _id: qid })
      if (!isValidObjectId(metadata?._id!)) throw Error('no quiz metadata present')
      if (!metadata) throw Error('no quiz metadata present')

      return metadata


   }


   async getMeta(qid: string, uid: string, draft: boolean = false) {

      const filterObject: FilterQuery<DocumentTypes.Quiz> = {}

      if (draft) {
         filterObject['aid'] = uid;
         filterObject['drafted'] = true
      }

      const metadata = await this.collections.quiz.findOne({ _id: qid, ...filterObject })
      if (!isValidObjectId(metadata?._id!)) throw Error('no quiz metadata present')
      if (!metadata) throw Error('no quiz metadata present')

      return metadata


   }

   async getCorrection(qid: string, aid: string) {

      const quizMetadataDoc = await this.collections.quiz.findOne({ _id: qid, showCorrection: true })
      if (!isValidObjectId(quizMetadataDoc?._id!)) throw Error('quiz not present')
      if (!quizMetadataDoc) throw Error('quiz not present')

      const quizQuestionDoc = await this.collections.questions.findOne({ qid })
      if (!isValidObjectId(quizQuestionDoc?._id!)) throw Error('quiz not present')
      if (!quizQuestionDoc) throw Error('quiz not present')


      quizQuestionDoc.data = quizQuestionDoc.data.map(question => {
         const q: QuizTypes.Question = {
            ...question,
            options: [question.options.at(-1)! as string]
         }

         return q
      })


      return {
         metadata: quizMetadataDoc,
         questions: quizQuestionDoc
      }



   }




   processQuestion(q: QuizTypes.ClientQuestion, qid: string) {
      const sid = Quiz.genId()
      const answer = q.options[q.options.length - 1]

      const pq: QuizTypes.Question = { ...q, sid, options: q.options, qid }
      const pa: QuizTypes.Answer = { answer, sid, qid }


      return {
         question: pq,
         answer: pa
      }
   }


   async getQuiz(
      params: {
         qid: string,
         drafted: boolean,
         userDoc: DocumentTypes.User,
         mode?: QuizTypes.Mode,
      }
   ) {




      const QuizMetadataDoc = await this.collections.quiz.findOne({ _id: params.qid })!
      if (!isValidObjectId(QuizMetadataDoc?._id)) throw Error('quiz not found')
      const QuizQuestionsDoc = await this.collections.questions.findById(QuizMetadataDoc?.questions)!
      if (!isValidObjectId(QuizQuestionsDoc?._id)) throw Error('quiz not found')




      if (params.drafted) {
         const isValid = !!(params.userDoc?.admin) && (params.userDoc.id === QuizMetadataDoc?.aid)
         if (!isValid) throw Error('sorry! you cannot view a drafted quiz unless you are the author')
         return this.gq(params.qid, { aid: params.userDoc.id!, drafted: true })
      }



      const result = await this.gq(params.qid, { drafted: false })

      result.questionsDoc.data = result.questionsDoc.data.map(q => {
         return { ...q, options: Quiz.scrambleOptions(q.options) }
      })


      const timeData = await this.processMode(params.mode ?? 'medium', result.questionsDoc.data.length! ?? 0)


      return {
         ...timeData,
         ...result
      }







   }



   async getQuizForClient(qid: string, mode: QuizTypes.Mode, userDoc: Document<unknown, any, DocumentTypes.User> & DocumentTypes.User & { _id: Types.ObjectId; }) {
      const QuizMetadataDoc = (await this.collections.quiz.findById(qid))!
      if (!isValidObjectId(QuizMetadataDoc?._id)) throw Error('quiz not found')
      const QuizQuestionsDoc = await this.collections.questions.findById(QuizMetadataDoc?.questions)!
      if (!isValidObjectId(QuizQuestionsDoc?._id)) throw Error('quiz not found')
      const timeObj = await this.processMode(mode ?? 'medium', QuizQuestionsDoc?.data?.length! ?? 0)

      const questions = QuizQuestionsDoc?.data.map(question => {
         return {
            ...question,
            options: Quiz.scrambleOptions(question.options)
         }
      }) ?? []


      const result: QuizTypes.ClientQuiz = {
         time: timeObj.time,
         mode: timeObj.mode,
         metadata: {
            title: QuizMetadataDoc.title,
            description: QuizMetadataDoc.description,
            image: QuizMetadataDoc.image,
            qid: QuizMetadataDoc.id,
            tags: QuizMetadataDoc.tags,
            showCorrection: QuizMetadataDoc?.showCorrection ?? false
         },
         questions,
         //TODO: remove the optional chains b4 prod.
         user: {
            aid: userDoc.id ?? '',
            email: userDoc.email ?? '',
            name: userDoc.name ?? ''
         }
      }



      return result as QuizTypes.ClientQuiz
   }

   static scrambleOptions(opts: string[]) {
      return opts.sort((a, b) => Math.random() - 0.5)
   }

   async processMode(mode: QuizTypes.Mode, questionNo: number) {
      let time = 0
      switch (mode) {
         case 'easy':
            time = questionNo * 30
            break;

         case 'medium':
            time = questionNo * 20
            break;

         case 'hard':
         default:
            time = questionNo * 15
            break;
      }

      return {
         time,
         mode: mode ?? 'hard'
      }
   }


   public static genId(): string {
      return shortid.generate()
   }



   async markQuiz(userAnswers: QuizTypes.ClientAnswer) {
      const quizDoc = await this.collections.quiz.findOne({ _id: userAnswers.qid })
      if (!(isValidObjectId(quizDoc?.id))) throw Error('quiz not found')
      const answersDoc = await this.collections.answers.findOne({ _id: quizDoc?.answers })
      if (!(isValidObjectId(answersDoc?.id))) throw Error('quiz not found')
      if (!(answersDoc && quizDoc)) throw Error('quiz not found')

      let quizScores = {
         score: 0,
         total: answersDoc.data.length,
         quizDoc
      }

      userAnswers.data.forEach((ans_) => {
         const isCorrect = answersDoc.data.findIndex(ans => ((ans.answer === ans_.answer) && (ans.qid === ans_.qid) && (ans.sid === ans_.sid))) !== -1
         quizScores.score = isCorrect === true ? quizScores.score += 1 : quizScores.score
      })

      return quizScores

   }


   async deleteQuiz(qid: string, aid: string) {
      const quizDoc = await this.collections.quiz.findOne({ _id: qid, aid: aid })
      if (!(isValidObjectId(quizDoc?.id))) throw Error('quiz not found')

      const questionsDoc = await this.collections.questions.findById(quizDoc?.questions!)!
      if (!(isValidObjectId(questionsDoc?.id))) throw Error('quiz not found')

      const promises = [

         this.collections.quiz.deleteOne({ id: qid! }),
         this.collections.questions.deleteMany({ qid }),
         this.collections.answers.deleteMany({ qid }),

      ]

      return Promise.all(promises)

   }

   async getQuizForUpdate(qid: string, aid: string) {

      const { quizDoc, questionsDoc } = await this.gq(qid, { aid, drafted: true })


      return {
         quizDoc,
         questionsDoc
      }
   }










   async gq(qid: string, filter: FilterQuery<DocumentTypes.Quiz> = {}) {
      const quizDoc = await this.collections.quiz.findOne({ _id: qid, ...filter })
      if (!(isValidObjectId(quizDoc?.id))) throw Error('quiz not found')
      if (!quizDoc) throw Error('quiz not found')

      const questionsDoc = await this.collections.questions.findById(quizDoc?.questions!)!
      if (!(isValidObjectId(questionsDoc?.id))) throw Error('quiz not found')
      if (!questionsDoc) throw Error('quiz not found')

      return {
         quizDoc,
         questionsDoc
      }
   }






   async update(qid: string, aid: string, payload: {
      metadata: QuizTypes.QuizMetadata,
      questions: QuizTypes.ClientQuestion[]
   }) {

      Quiz.checkQuizTypings(payload)

      const quizDoc = await this.collections.quiz.findOne({ id: qid, aid, drafted: true })
      if (!quizDoc) throw Error('quiz not found')
      if (!(isValidObjectId(quizDoc?.id))) throw Error('quiz not found')

      const questionsDoc = await this.collections.questions.findById(quizDoc?.questions!)!
      // if (!questionsDoc) throw Error('quiz not found')
      if (!(isValidObjectId(questionsDoc?.id))) throw Error('quiz not found')

      await this.collections.quiz.updateOne({ id: qid, aid }, {
         $set: {
            title: payload.metadata.title,
            description: payload.metadata.description,
            image: payload.metadata.image,
            tags: payload.metadata.tags,
            showCorrection: payload.metadata?.showCorrection ?? false
         }
      })


      const nQuestion: DocumentTypes.Question = { qid, data: [] }
      const nAnswer: DocumentTypes.Answer = { qid, data: [] }

      payload.questions.forEach(q => {
         const { question, answer } = this.processQuestion(q, qid)
         nQuestion.data.push(question)
         nAnswer.data.push(answer)
      })

      console.log(nQuestion)

      const promises = [
         this.collections.questions.updateOne(
            { _id: quizDoc?.questions! },
            { $set: nQuestion }
         ),
         this.collections.answers.updateOne(
            { _id: quizDoc?.answers! },
            { $set: nAnswer }
         )
      ]


      return Promise.all(promises)
   }





}