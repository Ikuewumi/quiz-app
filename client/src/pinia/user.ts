import { defineStore } from "pinia"
import { UserTypes, Types } from "types"
import { z } from "zod"
import { apiGet, apiPatch, apiPost } from "../composables/auth"

const zUserMetadata = z.object({
   name: z.string().min(1),
   description: z.string().min(0),
   image: z.string()
})

interface CustomUser extends UserTypes.UserMetadata, Types.TimeData { }


export const useUser = defineStore('useUser', {
   state: () => {
      return {
         name: "",
         email: "",
         image: "",
         description: "",
         admin: false,
         bookmarks: [],
         _id: "",
      } as CustomUser
   },




   actions: {
      async getUserData() {
         const result = await apiGet('user/metadata', true) as UserTypes.UserMetadata
         this.$state = result
      },



      async updateUserData(updateData: Metadata) {
         const requestData = zUserMetadata.parse(updateData)
         const result = await apiPatch('user/metadata', requestData) as UserTypes.UserMetadata
         return this.getUserData()
      }


   }



})

interface Metadata {

   name: string;
   description: string;
   image: string;

}