<template>
   <div data-p data-p-user class="sgrid even-cols">
      <Metadata :showEdit="true" :user="userData.$state" @to-admin="metadataM.toAdminPage"
         @edit-profile="metadataM.showUpdateModal" />
      <Modal header="Edit Profile" :show-modal="b.showUpdate" @close-modal="b.showUpdate = false">
         <UpdateMetadata @submit-form="metadataM.updateMetadata" />
      </Modal>



      <section data-f-container v-if="historyDocs.state.data.length">
         <div data-f>
            <h3>History</h3>
            <p>Here you can see your history so far</p>
         </div>
         <div class="dis-grid g-6">
            <div data-f-history-card-list>
               <HistoryCard v-for=" (quiz, i) in (historyDocs.state.data as DocumentTypes.History[])" :key="i"
                  :data="quiz" />
            </div>
            <PaginationBar :showMore="historyDocs.computedShouldShowMore" @show-more="historyDocs.promiseNextPage"
               :text="historyDocs.computedText" />
         </div>
      </section>

      <section data-f-container v-if="publishedQuizzes.state.data.length">
         <div data-f>
            <h3>Published</h3>
            <p>Here you can see and take your published quizes</p>
         </div>
         <div class="dis-grid g-6">
            <div data-f-quiz-card-list>
               <QuizCard v-for=" (quiz, i) in (publishedQuizzes.state.data as DocumentTypes.Quiz[])" :key="i"
                  :data="quiz" />
            </div>
            <PaginationBar :showMore="publishedQuizzes.computedShouldShowMore"
               @show-more="publishedQuizzes.promiseNextPage" :text="publishedQuizzes.computedText" />
         </div>
      </section>



      <Dialog :show-dialog="dialogM.booleans.logout" text="Do you want to logout?" v-if="dialogM.booleans.logout"
         @no="dialogM.hide('logout')" @yes="logout" />

      <section data-f-container>
         <div data-f>
            <h3>Account</h3>
         </div>
         <button id="logout-btn" data-btn-logout @click="dialogM.show('logout')">
            <svg viewBox="0 0 26 26">
               <use href="#shutdown_metro"></use>
            </svg>

            <span>Logout</span>
         </button>
      </section>
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { createToastPromise, useToast, title } from '../../composables';
import { clearTokens } from '../../composables/env'
import { useUser } from '../../pinia/user';
import Metadata from '../../components/user/Metadata.vue';
import Modal from '../../components/utitlities/Modal.vue';
import Dialog from '../../components/utitlities/Dialog.vue';
import { useRouter } from 'vue-router';
import { apiPost } from '../../composables/auth';
import { ApiTypes, DocumentTypes, QuizTypes } from 'types';
import { paginate } from '../../composables/pagination';
import ErrorComponent from '../../components/utitlities/ErrorComponent.vue';
const HistoryCard = defineAsyncComponent(() => import('../../components/quiz/HistoryCard.vue'))
const UpdateMetadata = defineAsyncComponent(() => import('../../components/user/UpdateMetadata.vue'))
const QuizCard = defineAsyncComponent(() => import('../../components/quiz/QuizCard.vue'))
const PaginationBar = defineAsyncComponent(() => import('../../components/utitlities/PaginationBar.vue'))


const userData = useUser()
const router = useRouter()
// let historyDocs = $ref(null as unknown as ApiTypes.PaginatedData<DocumentTypes.History>)
let publishedQuizzes = paginate(`lists/user/quizzes/${userData._id}?`, 20, false)
let historyDocs = paginate(`lists/history?`, 20, true)

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
      history: false,
      logout: false
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


const logout = () => {
   createToastPromise(async () => {

      const result = await apiPost('auth/logout', {}, true)
      useToast().el.show(result.message as string, false)
      clearTokens()
      userData.$reset()
      router.push('/auth')



   }, 'Signing off...', true)()


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
      await userData.getUserData()
      title(`${userData.$state.name} | Profile`)
      // await historyM.getHistory()
      await publishedQuizzes.value.start()
      await historyDocs.value.start()

   }, 'Loading User Data', false)()


})
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-p-user] {

   --col-start: 2;
   --col-width: 6;
   row-gap: var(--size-6);


   >* {
      grid-column: 2 / -2;
   }


   #logout-btn[data-btn-logout] {
      @include buttons;
      flex-basis: fit-content;
      width: fit-content;
      display: flex;
      place-items: center;
      gap: var(--size-2);
      --size: clamp(13px, 13px + 3vw, 15px);
      letter-spacing: 1px;
      --pin: 0.8rem;
      --pbl: 0.47rem;
      --bg: rgba(233, 20, 20, 0.456);
      --clr: #fff;
      --border-w: 0;

      box-shadow: 0 0 2px 1px rgb(0 0 0 / 0.2);

      svg {
         @include mSvg;
         --w: 25px;
         --f: rgb(0 0 0 / 0.2);
         --f-h: rgb(0 0 0 / 0.2);
         --bg: transparent;
         --bg-h: transparent;
      }


      &:hover {
         background: rgba(233, 20, 20, 0.6);

         svg {
            fill: #fff;
         }
      }


   }

}
</style>