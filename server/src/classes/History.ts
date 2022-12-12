import { Document, Model, StringExpressionOperatorReturningArray } from "mongoose";
import { DocumentTypes, QuizTypes } from "types";

export class History {

   constructor(public collections: { history: Model<DocumentTypes.History> }) {
   }




   async saveHistory(params: {

      aid: string,
      qid: string,
      data: QuizTypes.ScoreData,
      title: string,
      uid: string

   }) {
      const history = new this.collections.history({
         "aid": params.aid,
         "qid": params.qid,
         "data": params.data,
         "title": params.title,
         "uid": params.uid,
         "timestamp": Date.now()
      })
      const result = await history.save()
      return result
   }



}