import { defineStore } from "pinia"

const useMode = defineStore(
   'useMode',
   {
      state: () => {
         return {
            isAuthenticated: true,
            shouldShowHeader: false
         }
      },

      getters: {
         modeAuth: (state) => state.isAuthenticated,
         modeHeader: (state) => state.shouldShowHeader
      },

      actions: {
         on() { this.$state.isAuthenticated = true },
         off() { this.$state.isAuthenticated = false },

         showHeader() { this.$state.shouldShowHeader = true },
         hideHeader() { this.$state.shouldShowHeader = false },
      }
   }
)

export default useMode