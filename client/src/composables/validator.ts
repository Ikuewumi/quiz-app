import { z } from "zod"

export const zQuizMetadata = z.object({
   title: z.string(),
   description: z.string(),
   image: z.string(),
   tags: z.string().array().min(1),
   bookmarks: z.number().optional(),
   showCorrection: z.boolean().optional().default(false),
   drafted: z.boolean().optional().default(true),
   _id: z.any().optional(),
   createdAt: z.date().optional(),
   updatedAt: z.date().optional()
})

export const zTimeMode = z.object({
   time: z.number(),
   mode: z.enum(['easy', 'hard', 'medium']).default('hard')
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
   metadata: zQuizMetadata,
   questions: zQClient.array().min(1)
})

export const zQuizMode = z.enum(['easy', 'hard', 'medium']).default('hard')

export const zQClientCorrection = zQClient.extend({ options: z.string().array().min(1).max(1) })
export const zClientQuizForCorrection = zQuizMetadataExtra.extend({ questions: zQClientCorrection.array().min(1) })

export const zClientQuizWithQuestions = zQuizMetadataExtra.extend({ questions: zQServer.array().min(1) })



export const zFullQuiz = zClientQuizWithQuestions.extend({ answers: zAServer.array().min(1) })



