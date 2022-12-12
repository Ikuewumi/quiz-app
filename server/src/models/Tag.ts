import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.Tag>({
   tags: Array
})
schema.set('timestamps', true)

const m = model('tag', schema)

export default m