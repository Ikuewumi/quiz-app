import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.Question>({
   "data": Array,
   "qid": String
})
schema.set('timestamps', true)

const m = model('question', schema)

export default m