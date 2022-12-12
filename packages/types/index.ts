import { Model, ObjectId } from "mongoose"
import { z } from "zod"

export namespace DocumentTypes {
   export interface User extends Types.TimeData, AuthTypes.BasicUser, UserTypes.UserMetadata {
   }


   export interface Token extends Types.TimeData {
      token: string
   }

   export interface History extends Types.TimeData, HistoryTypes.History { }
   export interface Tag extends Types.TimeData, TagTypes.Tag { }

   export interface Test extends Types.TimeData {
      name: string
   }

   export interface Quiz extends Types.TimeData, QuizTypes.QuizMetadata {
      aid: string
      questions: string
      answers: string
   }

   export interface Question extends Types.TimeData, QuizTypes.Qid { data: Array<QuizTypes.Question> }
   export interface Answer extends Types.TimeData, QuizTypes.Qid { data: Array<QuizTypes.Answer> }

   export interface Q<T> {
      qId: string
      data: Array<T>
   }

   export interface Time extends Types.TimeData, QuizTypes.Time { }
}


export namespace UserTypes {
   export interface UserMetadata extends Types.TimeData {
      name: string
      email: string
      admin: boolean
      description: string
      image: string
      bookmarks: Array<string>
   }

   export interface ClientUserMetadata {
      name: string
      email: string
      admin: boolean
      description: string
      image: string
      bookmarks: Array<string>
      _id: string
      id: string
   }
}


export namespace MessageTypes {
   export interface Msg {
      message: string
   }
}


export namespace AuthTypes {
   export interface BasicUser {
      email: string,
      password: string
   }

   export interface SignInUser extends AuthTypes.BasicUser {
      name: string
   }

   export interface LogInUser extends AuthTypes.BasicUser { }


   export type Keys = {
      access: string,
      refresh: string
   }

   export type Tokens = {
      accessToken: string,
      refreshToken: string
   }

   export type DecodedToken = {
      id: string,
      email: string
   }


}

export namespace PropsTypes {

   export interface AuthLibraryConstructors {
      keys: AuthTypes.Keys,
      collections: {
         user: Model<DocumentTypes.User>,
         tokens: Model<DocumentTypes.Token>
      }
   }


}


export namespace Types {


   export interface TimeData {
      createdAt?: string
      updatedAt?: string,
      id?: string,
      _id?: string
   }


}


export namespace QuizTypes {

   export interface Time {
      timeToEnd: number
      mode: Mode
   }


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

   export interface QuizMetadata {
      title: string,
      description: string,
      image: string,
      tags: Array<string>,
      bookmarks?: number,
      showCorrection?: boolean,
      drafted?: boolean
   }

   export interface QMetadata extends Qid, QuizMetadata { }

   export interface ClientQuestion extends Q { }

   export interface Question extends Q, Sid, Qid { }

   export interface Answer extends Sid, Qid {
      answer: string
   }

   export interface Quiz {
      qId: string
      data: Array<Question>
   }

   export type Mode = "easy" | "medium" | "hard"

   export interface ClientQuiz {

      time: number
      mode?: Mode
      questions: Question[]
      metadata: QMetadata
      user: {
         name: string,
         email: string,
         aid: string
      }

   }

   export interface Time {
      m: number | (number | string),
      s: number | (number | string)
   }

   export interface ClientAnswer {
      qid: string;
      data: Answer[];
   }



   export interface ScoreData {

      score: number,
      total: number
   }

   export interface MarkedQuiz {
      scoreData: ScoreData,
      quizDoc: DocumentTypes.Quiz
   }


}





export namespace HistoryTypes {




   export interface History {
      aid: string
      qid: string
      data: QuizTypes.ScoreData
      title: string
      timestamp: number,
      uid: string
   }



}

export namespace TagTypes {

   export interface Tag {
      tags: Array<string>
   }

}




export namespace ApiTypes {

   export interface PaginatedData<T> {

      data: T[],
      count: number,
      page: number,
      maxPageCount: number,
      pageCount: number,


   }


}















export namespace ZodTypes {
   export const zUserMetadata = z.object({
      name: z.string().min(1),
      description: z.string().min(0),
      image: z.string()
   })
}















