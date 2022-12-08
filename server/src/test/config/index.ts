import { AuthTypes, QuizTypes } from "types"

/**  Global dummy user variables */
export const d: AuthTypes.SignInUser = {
   name: "Itachi Uchiha",
   email: 'a@b.c',
   password: '1234567'
}

/**A client question */
export const cq: QuizTypes.ClientQuestion[] = [{
   q: "new question",
   options: ["art", "position", "isnane", "correct"]
}]

export const quizMock_ = {
   aid: "636bf3c2ab46efdb27291ef7",
   metadata: {
      description: "A simple description",
      image: "",
      tags: ['david', 'biology', 'chemistry'],
      title: "A Quiz Mock"
   } as QuizTypes.QuizMetadata,
   questions: [
      {
         q: 'Mode of production',
         options: ['deserve', 'grabs', 'correct', 'tynpanum']
      },

      {
         q: 'New question',
         options: ['new', 'vise-like', 'order', 'inkling']
      }


   ] as QuizTypes.ClientQuestion[],

   updateQuestions: [
      {
         q: 'A socilogist is a human',
         options: ['true', 'false', 'i don\'t know']
      }
   ] as QuizTypes.ClientQuestion[]

}