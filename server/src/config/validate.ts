import { z } from "zod"
import process from "node:process"
import shortid from 'shortid'
import { Model, isValidObjectId, Document, FilterQuery, SortOrder } from "mongoose"
import { DocumentTypes, Types } from "types"
import { DbClass } from "./db.js"




export const zQuizMetadata = z.object({
   title: z.string(),
   description: z.string(),
   image: z.string(),
   tags: z.string().array().min(1),
   bookmarks: z.number().optional(),
   showCorrection: z.boolean().optional().default(false),
   drafted: z.boolean().optional().default(true),
   _id: z.string().optional(),
   createdAt: z.string().optional(),
   updatedAt: z.string().optional()
})


export const zQuizMetadataExtra = zQuizMetadata.extend({ aid: z.string().min(0) })

export const zQExtra = z.object({ sid: z.string() })

export const zQClient = z.object({
   q: z.string(),
   info: z.string().optional(),
   image: z.string().min(1).optional(),
   options: z.string().array().min(2)
})
export const zQServer = zQClient.extend(zQExtra.shape)

export const zAClient = z.object({ answer: z.string() })
export const zAServer = zAClient.extend(zQExtra.shape)


export const zClientQuiz = z.object({
   metadata: zQuizMetadataExtra,
   questions: zQClient.array().min(1)
})

export const zQuizMode = z.enum(['easy', 'hard', 'medium']).default('hard')


export const zClientQuizWithQuestions = zQuizMetadataExtra.extend({ questions: zQServer.array().min(1) })

export const zFullQuiz = zClientQuizWithQuestions.extend({ answers: zAServer.array().min(1) })








interface Config { page: number, limit: number }
interface Selects { [index: string]: 1 }
type SortQuery<T> = { [P in keyof T]?: 1 | -1; }

async function createSelectField(selects: string[]) {
   const obj = {} as unknown as Selects;
   selects.forEach(key => obj[key] = 1);
   return obj
}


//TODO. If Stable, add to the project
async function getPaginatedData<T>(
   model: Model<T>,
   filters: FilterQuery<T> = {},
   selects: string[],
   sort: string | {
      [key: string]: SortOrder | { $meta: "textScore"; };
   } | [string, SortOrder][] | null | undefined = { createdAt: 1 },
   config: Config = { page: 1, limit: 20 },
) {


   const result = await model.find(filters)
      .select(createSelectField(selects))
      .sort(sort)
      .skip(config.limit * config.page)
      .limit(config.limit)

   const count = await model.count(filters)



   return {
      data: result, count: count, page: config.page,
      maxPageCount: config.limit, pageCount: result.length
   }





}























//TODO: IF it is stable and works, move this class to the main QuizClass doc: file:///C:/Users/Ayobami/Projects/quiz-app/server/src/classes/Quiz.ts and the types


export class Quiz {

   constructor(public QuizModel: Model<QuizModel>) {
   }


   static genId = () => shortid.generate()


   async create(payload: unknown, aid: string) {

      const dbDoc = new this.QuizModel(Quiz.getDbObject(payload, aid))
      const isInvalid = await this.QuizModel.exists({ title: dbDoc.title })
      if (isInvalid) throw Error('please try another name for your quiz. This one\'s been taken')
      const r1 = await dbDoc.save()
      const result = zQuizMetadataExtra.strip().parse(r1)
      return result
   }


   /**Read to update Quiz*/
   async read(qid: string, filters: FilterQuery<QuizModel> = {}) {
      const dbDoc = await this.QuizModel.findOne({ _id: qid, ...filters }).select(Quiz.questionsFields)
      if (!dbDoc) throw Error('quiz not found')
      if (!isValidObjectId(dbDoc?.id)) throw Error('quiz not found')

      const result = zClientQuizWithQuestions.strip().parse(dbDoc)
      return result
   }

   async update(payload: unknown, aid: string, qid: string) {
      const dbDoc = Quiz.getDbObject(payload, aid)
      const r = await this.QuizModel.updateOne({ _id: qid }, { ...dbDoc })
      if (!r.modifiedCount) throw Error('could not modify quiz')

      return `Quiz successfully updated`
   }



   async remove(qid: string, aid: string) {
      const r = await this.QuizModel.deleteOne({ _id: qid, aid })
      if (!r.deletedCount) throw Error('could not delete quiz')

      return `Quiz successfully deleted`
   }


   /**Mark Quizzes */
   async mark(qid: string, userAnswers: unknown) {

      const answers = (zAServer.strip().array().min(1)).parse(userAnswers)

      const dbDoc = await this.QuizModel.findOne({ _id: qid, drafted: false }).select(Quiz.answersFields)
      if (!dbDoc) throw Error('quiz not found')
      if (!isValidObjectId(dbDoc?.id)) throw Error('quiz not found')

      const r1 = zFullQuiz.strip().parse(dbDoc)
      const r2 = zQuizMetadataExtra.strip().parse(dbDoc)

      let scoreData = { score: 0, total: r1.questions.length }


      answers.forEach((ans_) => {
         const isCorrect = r1.answers.findIndex(ans => ((ans.answer === ans_.answer) && (ans.sid === ans_.sid))) !== -1
         scoreData.score = !!(isCorrect) ? scoreData.score += 1 : scoreData.score
      })


      return {

         quizDoc: r2,
         scoreData

      }


   }


































   /**Read a quiz ready for client to do */
   async quiz(qid: string, mode: Mode) {
      const quizDoc = await this.read(qid, { drafted: false })
      const timeObj = Quiz.processMode(mode, quizDoc.questions.length)

      //Scramble options
      quizDoc.questions = quizDoc.questions.sort(_ => Math.random() - 0.5).map(q => {
         return { ...q, options: Quiz.scrambleOptions(q.options) }
      })

      return {
         ...quizDoc,
         ...timeObj
      }
   }


   /** read a drafted quiz to update it */
   async adminRead(qid: string, userDoc: DocumentTypes.User) {
      const quizDoc = await this.read(qid, { drafted: true, aid: userDoc.id })
      const isValid = !!(userDoc.admin)

      if (!isValid) throw Error(`oops! you do not have permissions to view this`)


      return {
         ...quizDoc
      }
   }


   async getCorrection(qid: string) {
      const quizDoc = await this.read(qid, { drafted: false, showCorrection: true })
      quizDoc.questions = quizDoc.questions.map(question => {
         return {
            ...question,
            options: [question.options[question.options.length - 1]]
         }
      })

      return {
         ...quizDoc
      }
   }



   async changeDraftStatus(qid: string, aid: string, drafted: boolean = false) {
      const r = await this.QuizModel.updateOne({ _id: qid, aid }, { drafted })
      if (!r.modifiedCount) throw Error('could not modify quiz')

      return `Quiz successfully updated`
   }

















   async readMetadata(qid: string, filters: FilterQuery<QuizModel> = {}) {
      const dbDoc = await this.QuizModel.findOne({ _id: qid, ...filters }).select(Quiz.metadataFields)
      if (!dbDoc) throw Error('quiz not found')
      if (!isValidObjectId(dbDoc?.id)) throw Error('quiz not found')

      const result = zQuizMetadataExtra.strip().parse(dbDoc)
      return result
   }


   static getDbObject(payload: unknown, aid: string = "") {
      const { metadata, questions } = zClientQuiz.parse(payload)
      const dbData = Quiz.processQuestions(questions)

      const dbDoc: fullQuiz = {
         title: metadata.title,
         description: metadata.description,
         image: metadata.image,
         tags: metadata.tags,
         questions: dbData.questions,
         answers: dbData.answers,
         showCorrection: metadata.showCorrection,
         drafted: metadata.drafted,
         aid: aid,
      }

      return dbDoc

   }



   private static processQuestion(q: Q) {
      const sid = Quiz.genId()
      const a = q.options[q.options.length - 1]

      const question = { ...q, sid } as Question
      const answer = { sid, answer: a } as Answer


      return { question, answer }
   }

   private static processQuestions(qs: Q[]) {
      const [questions, answers] = [[] as Question[], [] as Answer[]]

      qs.forEach(q => {
         const { question, answer } = Quiz.processQuestion(q)
         questions.push(question); answers.push(answer);
      })

      return { questions, answers }

   }

   static scrambleOptions(opts: string[]) {
      return opts.sort((a, b) => Math.random() - 0.5)
   }

   private static processMode(m: string, q: number) {
      let mode: Mode;
      const mode_ = zQuizMode.safeParse(m)
      mode = mode_.success ? mode_.data : 'hard'

      let timePerQuestion = 0
      timePerQuestion = (mode === 'easy') ? 25 : ((mode === 'medium') ? 15 : ((mode === 'hard') ? 10 : 10))

      return {
         time: timePerQuestion * q,
         mode
      }


   }



   static metadataFields = {
      title: 1, description: 1, image: 1, tags: 1, aid: 1,
      bookmarks: 1, showCorrection: 1, drafted: 1
   }


   static questionsFields = {
      ...Quiz.metadataFields, questions: 1
   }

   static answersFields = {
      ...Quiz.questionsFields, answers: 1
   }



   static genClass = () => {
      return (new Quiz(DbClass.getProp<QuizModel>('quiz')))
   }














}




interface QuizModel extends fullQuiz, Types.TimeData { }


export interface Sid {
   sid: string
}

export interface Qid {
   qid: string
}

export interface Q {
   q: string,
   info?: string,
   options: Array<string>,
   image?: string
}

export interface Question extends Sid, Q { }
export interface Answer extends Sid { answer: string }

export interface QuizMetadata {
   title: string,
   description: string,
   image: string,
   tags: Array<string>,
   bookmarks?: number,
   showCorrection?: boolean,
   drafted?: boolean
}

type Mode = 'easy' | 'medium' | 'hard'


export interface fullQuiz extends QuizMetadata {
   aid: string,
   questions: Question[],
   answers: Answer[],
}