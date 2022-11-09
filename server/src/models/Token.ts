import { model, Schema } from "mongoose";
import { DocumentTypes } from "types"

const schema = new Schema<DocumentTypes.Token>({
   token: String
})

const m = model('token', schema)
export default m