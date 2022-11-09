import { Model, connect } from "mongoose"

type DbModelsObject = {
   [index: string]: Model<any>
}

export class DbLibrary {

   constructor(
      readonly url: string,
      private props: DbModelsObject
   ) { }

   async connectToDb() {
      return connect(this.url)
   }

   getProp<T>(key: string): Model<T> {
      const isPresent = key in this.props
      if (!isPresent) throw Error('this db was not registered')
      return this.props[key]
   }
}