import { QuizTypes } from "types";

export class QuizCreationLogic {

   constructor(
      public store: PiniaStores["creation"]
   ) {
   }

   storeMetadata(data: QuizTypes.QuizMetadata) {
      this.store.updateMetadata(data)
      console.log(data)
   }

   createEmptyQuestion() {
      if (this.store.quizData.length >= 100) throw Error('limit reached! you can only add 100 questions to a quiz')
      const emptyQuestion: QuizTypes.ClientQuestion = { q: "", options: [] }
      this.store.quizData.push(emptyQuestion)
      this.store.currentIndex = (this.store.quizData.length - 1)
   }

   saveQuestion(newVal: QuizTypes.ClientQuestion, index?: number) {
      this.store.quizData = this.store.quizData.map((q, i) => {
         if (i === (index ?? this.store.currentIndex)) return newVal
         else return q
      })
   }

   clearUnusedQuestions() {
      this.store.quizData = this.store.quizData.filter(question => {
         return (question.q.trim() > '') && (question.options.length > 1)
      })
   }

   removeQuestion(i: number) {
      this.store.quizData = this.store.quizData.filter((_, i_) => i !== i_)
   }





}