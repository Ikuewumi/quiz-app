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

