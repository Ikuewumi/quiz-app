import { model, Schema } from "mongoose";
interface TestInterface {
   name: string
}

const schema = new Schema<TestInterface>({
   name: String
})
schema.set('timestamps', true)

const m = model('test', schema)

export default m