import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.Quiz>({
   "aid": String,
   "answers": String,
   "description": String,
   "image": {
      type: String,
      default: ''
   },
   "questions": String,
   "tags": Array,
   "title": String,
   "bookmarks": Number,
   "drafted": Boolean,
   "showCorrection": Boolean
})
schema.set('timestamps', true)

const m = model('quiz', schema)

export default m