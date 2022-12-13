import { isValidObjectId, Model } from "mongoose";
import { z } from "zod"
import { DocumentTypes } from "types";
import { DbClass } from "../config/db.js";

const zTag = z.array(z.string())

export class Tag {

   constructor(public collections: { tag: Model<DocumentTypes.Tag> }) {
   }

   static createClass(): Tag {
      const newClass = new Tag({ tag: DbClass.getProp<DocumentTypes.Tag>('tag') })
      return newClass
   }

   static myTags = ['medicine', 'engineering', 'history', 'computing', 'social sciencies', 'arts']

   async createTagDoc() {

      let t: string[] = []
      const tagCount = await this.collections.tag.count()

      if (!tagCount) {
         const n = new this.collections.tag({ tags: [] })
         await n.save()
      } else {
         const tagDoc = (await this.collections.tag.findOne({}))!
         t = tagDoc['tags']
      }

      return t


   }

   async updateTags(newTags: string[], removeTags: string[] = []) {
      const rTags = zTag.parse(removeTags).map(tag => tag.toLowerCase())
      const tags = zTag.parse(newTags).map(tag => tag.toLowerCase())
      let oldTags = await this.createTagDoc()
      // oldTags = [...oldTags.filter(t => !tags.includes(t)), ...tags]

      // return this.collections.tag.updateOne({}, { $set: { tags: oldTags } })

   }


   async getTags() {

      const tagDoc = await this.collections.tag.findOne()
      return tagDoc?.tags ?? []



   }


}