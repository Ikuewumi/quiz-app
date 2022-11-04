import { defineStore } from "pinia"

export default defineStore(
   'useMode',
   {
      state: () => {
         return {
            isAuthenticated: true
         }
      },

      getters: {
         modeAuth: (state) => state.isAuthenticated
      },

      actions: {
         on() { this.$state.isAuthenticated = true },
         off() { this.$state.isAuthenticated = false }
      }
   }
)