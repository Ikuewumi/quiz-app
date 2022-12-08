import { defineStore } from "pinia";

export interface StoreTypings {
   img: string
}

export const useQuizQuestion = defineStore('useQuizQuestion', {
   state: () => {
      return {
         refs: {
            img: '',
         } as StoreTypings
      }
   },


   actions: {
      resetRefs(data?: StoreTypings) {
         this.$state.refs.img = data?.img ?? ''
      },
      setImgRef(str: string = '') {
         this.$state.refs.img = str
      }
   }


})