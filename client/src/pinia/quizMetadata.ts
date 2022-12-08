import { defineStore } from "pinia";

export interface StoreTypings {
   img: string,
   tags: string[]
}

export const useQuizMetadataData = defineStore('useQuizMetadataData', {
   state: () => {
      return {
         refs: {
            img: '',
            tags: []
         } as StoreTypings
      }
   },


   actions: {
      resetRefs(data?: StoreTypings) {
         this.$state.refs.img = data?.img ?? ''
         this.$state.refs.tags = data?.tags ?? []
      }
   }


})