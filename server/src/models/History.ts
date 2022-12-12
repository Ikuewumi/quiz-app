import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.History>({
   "data": Object,
   "qid": String,
   "aid": String,
   "uid": String,
   "title": String,
   "timestamp": { type: Number, default: Date.now }
})
schema.set('timestamps', true)

const m = model('hostory', schema)

export default m