import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.Answer>({
   "data": Array,
   "qid": String
})
schema.set('timestamps', true)

const m = model('answer', schema)

export default m