import { defineStore } from "pinia";
import { useToast } from "../composables";




export const useLoader = defineStore('useLoader', {
   state: () => {
      return {
         interval: 0,
         msg: ''
      }
   },

   actions: {
      showLoader(msg: string, t: number = 2000) {
         clearTimeout(this.interval)
         this.msg = msg
         this.interval = setTimeout(() => {
            this.msg = ''
         }, t)
      },


      show(msg: string) {
         clearTimeout(this.interval)
         this.msg = msg
      },


      hide() {
         clearTimeout(this.interval)
         this.msg = ''
      }
   }
})