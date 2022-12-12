import { FilterQuery, Model, SortOrder } from "mongoose";
import { DocumentTypes } from "types";
import { AuthLibrary } from "./Auth.js";
import { Quiz } from "./Quiz.js"
import { DbClass } from "../config/db.js";
import { History } from "./History.js";




export class User {


   constructor(
      public authClass: AuthLibrary,
      public collections: {
      }
   ) {

   }




   getQuizzes() { }




}








export class UserListClass extends History {


   constructor(
      public collections: {
         quiz: Model<DocumentTypes.Quiz>,
         history: Model<DocumentTypes.History>
      }
   ) {
      super({ history: collections.history })
   }

   static pageLimit = 20;
   static getMore = (pageNum: number): number => (pageNum - 1) * UserListClass.pageLimit
   static getSelects = (fields: string[]) => {
      const obj: { [index: string]: 1 } = {}
      fields.forEach(f => obj[f] = 1)
      return obj
   };
   static selectFields = {
      "quiz": ['title', 'aid', 'description', 'tags', 'image', 'answers', 'questions', 'bookmarks', 'drafted', 'showCorrection'],
      'history': ['title', 'aid', 'qid', 'uid', 'data', 'timestamp']
   }

   static createClass() {
      const newClass = new UserListClass({
         quiz: DbClass.getProp('quiz'),
         history: DbClass.getProp('history')
      })


      return newClass
   }




   async getDraftQuizzes(aid: string, page: number = 1) {


      const result = await this.getQuizzes({
         aid: aid,
         filters: { drafted: true },
         page: page,
         select: UserListClass.getSelects(UserListClass.selectFields.quiz),
         sort: { createdAt: -1 }
      })

      return result


   }

   async getNormalQuizzes(aid: string, page: number = 1) {


      const result = await this.getQuizzes({
         aid: aid,
         filters: { drafted: false },
         page: page,
         select: UserListClass.getSelects(UserListClass.selectFields.quiz),
         sort: { createdAt: -1 }
      })

      return result


   }


   async getQuizzes(
      params: {
         aid: string,
         filters: FilterQuery<DocumentTypes.Quiz>,
         page: number,
         sort: { [key: string]: 1 | -1 },
         select: { [key: string]: 1 }
      }
   ) {

      const result = await this.collections.quiz
         .find({ aid: params.aid, ...params.filters })
         .select(params.select)
         .sort()
         .limit(UserListClass.pageLimit)
         .skip(UserListClass.getMore(params.page))

      const count = await this.collections.quiz.countDocuments({ aid: params.aid, ...params.filters })



      return {

         data: result,
         count: count,
         page: params.page,
         maxPageCount: UserListClass.pageLimit,
         pageCount: result.length

      }


   }


   async getQuizList(
      params: {
         filters: FilterQuery<DocumentTypes.Quiz>,
         page: number,
         sort: { [key: string]: 1 | -1 },
         select: { [key: string]: 1 }
      }
   ) {

      const result = await this.collections.quiz
         .find({ ...params.filters })
         .select(params.select)
         .sort()
         .limit(UserListClass.pageLimit)
         .skip(UserListClass.getMore(params.page))

      const count = await this.collections.quiz.countDocuments({ ...params.filters })



      return {

         data: result,
         count: count,
         page: params.page,
         maxPageCount: UserListClass.pageLimit,
         pageCount: result.length

      }


   }







   protected async getUserHistory(
      params: {
         uid: string,
         filters: FilterQuery<DocumentTypes.History>,
         page: number,
         sort: { [key: string]: 1 | -1 },
         select: { [key: string]: 1 }
      }
   ) {

      const result = await this.collections.history
         .find({ uid: params.uid, ...params.filters })
         .select(params.select)
         .sort({ createdAt: -1 })
         .limit(UserListClass.pageLimit)
         .skip(UserListClass.getMore(params.page))

      const count = await this.collections.history.countDocuments({ uid: params.uid, ...params.filters })



      return {

         data: result,
         count: count,
         page: params.page,
         maxPageCount: UserListClass.pageLimit,
         pageCount: result.length

      }


   }






   public async getHistory(uid: string, page: number = 1) {


      const result = await this.getUserHistory({

         uid: uid,
         filters: {},
         page: page,
         select: UserListClass.getSelects(UserListClass.selectFields.history),
         sort: { createdAt: -1 }


      })



      return result
   }










}