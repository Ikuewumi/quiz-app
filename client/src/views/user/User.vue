<template>
   <div data-p data-p-user class="sgrid even-cols">
      <Metadata :user="userData.$state" @to-admin="metadataM.toAdminPage" @edit-profile="metadataM.showUpdateModal" />
      <Modal header="Edit Profile" :show-modal="b.showUpdate" @close-modal="b.showUpdate = false">
         <UpdateMetadata @submit-form="metadataM.updateMetadata" />
      </Modal>
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { createToastPromise } from '../../composables';
import { useUser } from '../../pinia/user';
import Metadata from '../../components/user/Metadata.vue';
import Modal from '../../components/utitlities/Modal.vue';
import { useRouter } from 'vue-router';
let UpdateMetadata = defineAsyncComponent(() => import('../../components/user/UpdateMetadata.vue'))

const userData = useUser()
const router = useRouter()



const b = $ref({
   showUpdate: false
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





onMounted(() => {

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