import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.Test>({
   name: String
})
schema.set('timestamps', true)

const m = model('test', schema)

export default m