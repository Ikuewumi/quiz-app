import { Model, ObjectId } from "mongoose"

export namespace DocumentTypes {
   export interface User extends Types.TimeData, AuthTypes.BasicUser {
      name: string
      admin: boolean
      description: string
      image: string
      bookmarks: Array<string>
   }


   export interface Token extends Types.TimeData {
      token: string
   }

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
      updatedAt?: string
   }


}


export namespace QuizTypes {


   export interface Sid {
      sid: string
   }

   export interface Qid {
      qid: string
   }

   interface Q {
      q: string,
      info?: string,
      options: Array<string>
   }

   export interface QuizMetadata {
      title: string,
      description: string,
      image: string,
      tags: Array<string>
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

   export interface ClientQuiz {

      time: number
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




}