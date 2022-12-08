import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.Time>({
   "timeToEnd": Number,
   "mode": {
      type: String,
      default: 'easy'
   }
})
schema.set('timestamps', true)

const m = model('time', schema)

export default m