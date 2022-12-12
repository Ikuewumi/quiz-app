<template>
   <div data-p data-p-user class="sgrid even-cols">
      <Metadata :user="userData.$state" @to-admin="metadataM.toAdminPage" @edit-profile="metadataM.showUpdateModal" />
      <Modal header="Edit Profile" :show-modal="b.showUpdate" @close-modal="b.showUpdate = false">
         <UpdateMetadata @submit-form="metadataM.updateMetadata" />
      </Modal>
      <div data-f-history-list v-if="dialogM.booleans.history">
         <HistoryCard v-for="(history, i) of historyDocs.data" :data="history" :key="i" />
      </div>
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { createToastPromise } from '../../composables';
import { useUser } from '../../pinia/user';
import Metadata from '../../components/user/Metadata.vue';
import Modal from '../../components/utitlities/Modal.vue';
import { useRouter } from 'vue-router';
import { apiGet } from '../../composables/auth';
import { ApiTypes, DocumentTypes } from 'types';
let HistoryCard = defineAsyncComponent(() => import('../../components/quiz/HistoryCard.vue'))
let UpdateMetadata = defineAsyncComponent(() => import('../../components/user/UpdateMetadata.vue'))

const userData = useUser()
const router = useRouter()
let historyDocs = $ref(null as unknown as ApiTypes.PaginatedData<DocumentTypes.History>)

const b = $ref({
   showUpdate: false
})


const booleans = $ref({
   quiz: false,
   metadata: false,
   postquiz: false
} as { [index: string]: boolean })





const dialogM = $ref({
   booleans: {
      history: false
   } as { [index: string]: boolean },


   show(key: string) {
      const isValid = key in dialogM.booleans
      if (isValid) dialogM.booleans[key] = true
   },

   hide(key: string) {
      const isValid = key in dialogM.booleans
      if (isValid) dialogM.booleans[key] = false
   }
})


const adminM = {



}





const metadataM = {

   async showUpdateModal() {
      b.showUpdate = true
   },



   async updateMetadata(payload: InputMetadata) {

      await createToastPromise(
         async () => await userData.updateUserData(payload),
         'Updating user profile',
         true
      )()

      b.showUpdate = false



   },
   async toAdminPage() {
      return router.push('/admin')
   }



}



const historyM = {


   async getHistory() {
      dialogM.hide('history')
      historyDocs = await apiGet(`lists/history?page=1`, true)
      dialogM.show('history')
      // console.log(r)
   }


}



















onMounted(() => {

   historyM.getHistory()

   createToastPromise(async () => {
      userData.getUserData()
   }, 'Loading User Data', false)()


})
</script>

<style lang="scss">
[data-p-user] {

   --col-start: 2;
   --col-width: 6;
   row-gap: var(--size-6);


   >* {
      grid-column: 2 / -2;
   }

}
</style>