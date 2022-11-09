import { model, Schema } from "mongoose";
import { DocumentTypes } from "types";

const schema = new Schema<DocumentTypes.User>({
   name: String,
   email: String,
   password: String,
   admin: Boolean,
   description: String,
   image: String,
   bookmarks: Array,
})
schema.set('timestamps', true)


const m = model('user', schema)

export default m
