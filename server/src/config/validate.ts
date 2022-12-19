import { z } from "zod"
import { Model, FilterQuery, SortOrder } from "mongoose"




export const zQuizMetadata = z.object({
   title: z.string(),
   description: z.string(),
   image: z.string(),
   tags: z.string().array().min(1),
   bookmarks: z.number().optional(),
   showCorrection: z.boolean().optional().default(false),
   drafted: z.boolean().optional().default(true),
   _id: z.string().optional(),
   createdAt: z.string().optional(),
   updatedAt: z.string().optional()
})


export const zQuizMetadataExtra = zQuizMetadata.extend({ aid: z.string().min(0) })

export const zQExtra = z.object({ sid: z.string() })

export const zQClient = z.object({
   q: z.string(),
   info: z.string().optional(),
   image: z.string().min(1).optional(),
   options: z.string().array().min(2)
})
export const zQServer = zQClient.extend(zQExtra.shape)

export const zAClient = z.object({ answer: z.string() })
export const zAServer = zAClient.extend(zQExtra.shape)


export const zClientQuiz = z.object({
   metadata: zQuizMetadataExtra,
   questions: zQClient.array().min(1)
})

export const zQuizMode = z.enum(['easy', 'hard', 'medium']).default('hard')


export const zClientQuizWithQuestions = zQuizMetadataExtra.extend({ questions: zQServer.array().min(1) })

export const zFullQuiz = zClientQuizWithQuestions.extend({ answers: zAServer.array().min(1) })








interface Config { page: number, limit: number }
interface Selects { [index: string]: 1 }
type SortQuery<T> = { [P in keyof T]?: 1 | -1; }

async function createSelectField(selects: string[]) {
   const obj = {} as unknown as Selects;
   selects.forEach(key => obj[key] = 1);
   return obj
}


//TODO. If Stable, add to the project
async function getPaginatedData<T>(
   model: Model<T>,
   filters: FilterQuery<T> = {},
   selects: string[],
   sort: string | {
      [key: string]: SortOrder | { $meta: "textScore"; };
   } | [string, SortOrder][] | null | undefined = { createdAt: 1 },
   config: Config = { page: 1, limit: 20 },
) {


   const result = await model.find(filters)
      .select(createSelectField(selects))
      .sort(sort)
      .skip(config.limit * config.page)
      .limit(config.limit)

   const count = await model.count(filters)



   return {
      data: result, count: count, page: config.page,
      maxPageCount: config.limit, pageCount: result.length
   }





}


















export const zUserMetadata = z.object({
   name: z.string().default('Anonymous'),
   email: z.string().default('anon@anon'),
   admin: z.boolean().default(false),
   description: z.string().default(''),
   image: z.string().default(''),
   bookmarks: z.string().array().default([]),
})


// console.log(zUserMetadata.strip().parse({}))