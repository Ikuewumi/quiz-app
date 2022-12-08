import { defineStore } from "pinia";
import { QuizTypes } from "types";
import { Store } from "pinia";

export interface StoreTypings {
   quizData: QuizTypes.ClientQuestion
   filter: { id: number }
}


export const useQuizCreation = defineStore('useQuizCreation', {

   state: () => {
      return {
         quizData: [] as StoreTypings["quizData"][],
         quizMetadata: {
            title: "",
            description: "",
            tags: [],
            image: "",
         } as QuizTypes.QuizMetadata,
         currentIndex: -1
      }
   },

   getters: {
      getCurrentQuestion: (state) => state.quizData[state.currentIndex] ?? null
   },


   actions: {
      init(data: QuizTypes.ClientQuestion[] = []) {
         this.quizData = data ?? []
      },

      add(...args: QuizTypes.ClientQuestion[]) {
         this.quizData.push(...args)
      },


      removeByIndex(filter: StoreTypings["filter"]) {
         this.quizData = this.quizData.filter((_, i) => i !== filter.id)
      },

      updateMetadata(data: QuizTypes.QuizMetadata) {
         this.quizMetadata = data
      },

      reset() {
         this.quizData = []
         this.quizMetadata = {
            title: "",
            description: "",
            tags: [],
            image: "",
         }
         this.currentIndex = -1
      }

   }




})

const store = useQuizCreation()


declare global {
   interface PiniaStores {
      "creation": typeof store
   }
}
