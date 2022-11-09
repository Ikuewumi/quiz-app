import { DbLibrary } from "../classes/Db"
import TestModel from "../models/Test"
import UserModel from "../models/User"
import TokenModel from "../models/Token"

export const DbClass = new DbLibrary(process.env.DB_URI!, {
   user: UserModel,
   test: TestModel,
   token: TokenModel,
})

export const connectDb = async () => DbClass.connectToDb()