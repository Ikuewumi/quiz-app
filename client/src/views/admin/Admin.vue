<template>
   <div data-p data-p-user class="sgrid even-cols">
      <Metadata :user="userData.$state" @to-admin="metadataM.toAdminPage" @edit-profile="metadataM.showUpdateModal" />

      <section data-f-container>
         <div data-f>
            <h3>Actions</h3>
         </div>

         <div data-f-actions-btn-bar>
            <RouterLink to="/admin/create">
               <button>
                  <svg viewBox="0 0 26 26">
                     <use href="#plus_metro"></use>
                  </svg>

                  <span>Add Quiz</span>
               </button>
            </RouterLink>
         </div>
      </section>



      <section data-f-container>
         <div data-f>
            <h3>Drafts</h3>
            <p>Here you can edit your quiz drafts</p>
         </div>



         <div data-f-quiz-card-list v-if="drafts.data.length">

            <QuizCard v-for="(draft, i) in drafts.data" :key="i" :data="draft" />



         </div>

         <ErrorComponent v-else msg="No Quizzes Present" />

      </section>


      <section data-f-container>
         <div data-f>
            <h3>Published</h3>
            <p>Here you can see and take your published quizes</p>
         </div>



         <div data-f-quiz-card-list v-if="quizzes.data.length">

            <QuizCard v-for="(quiz, i) in quizzes.data" :key="i" :data="quiz" />



         </div>

         <ErrorComponent v-else msg="No Quizzes Present" />
      </section>

















      <Modal header="Edit Profile" :showModal="b.showUpdate" @close-modal="b.showUpdate = false">
         <UpdateMetadata @submit-form="metadataM.updateMetadata" />
      </Modal>
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { createToastPromise, useToast } from '../../composables';
import { useUser } from '../../pinia/user';
import Metadata from '../../components/user/Metadata.vue';
import Modal from '../../components/utitlities/Modal.vue';
import { apiGet } from '../../composables/auth';
import { ApiTypes, DocumentTypes } from 'types';
import { RouterLink } from "vue-router";
import ErrorComponent from '../../components/utitlities/ErrorComponent.vue';
let UpdateMetadata = defineAsyncComponent(() => import('../../components/user/UpdateMetadata.vue'))
let QuizCard = defineAsyncComponent(() => import('../../components/quiz/QuizCard.vue'))

const userData = useUser()

let drafts = $ref({
   data: [],
   page: 0,
   count: 0,
   maxPageCount: 0,
   pageCount: 0
} as ApiTypes.PaginatedData<DocumentTypes.Quiz>)

let quizzes = $ref({
   data: [],
   page: 0,
   count: 0,
   maxPageCount: 0,
   pageCount: 0
} as ApiTypes.PaginatedData<DocumentTypes.Quiz>)



const b = $ref({
   showUpdate: false
})





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
      useToast().el.show(`Already on admin page`, false)
   }



}





onMounted(() => {

   createToastPromise(async () => {
      await userData.getUserData()


      const r = await apiGet('admin/drafts', true) as ApiTypes.PaginatedData<DocumentTypes.Quiz>
      const r2 = await apiGet('admin/quizzes', true) as ApiTypes.PaginatedData<DocumentTypes.Quiz>
      drafts = r
      quizzes = r2


      console.log(r, r2)




   }, 'Loading Admin Data....', true)()


})
</script>

<style lang="scss">
@use "./../../scss/mixins/input.scss" as *;

[data-p-user] {

   --col-start: 2;
   --col-width: 6;
   row-gap: var(--size-4);


   >* {
      grid-column: 2 / -2;
   }

   [data-f-actions-btn-bar] {


      button svg {
         @include mSvg;
         --w: 25px;
         --f: rgb(0 0 0 / 0.2);
         --f-h: rgb(0 0 0 / 0.2);
         --bg: transparent;
         --bg-h: transparent;
      }

      button {
         @include buttons;
         flex-basis: fit-content;
         display: flex;
         place-items: center;
         // width: 100%;
         // align-items: ;
         gap: var(--size-1);
         --size: clamp(13px, 13px + 3vw, 15px);
         letter-spacing: 1px;
         --pin: 0.9rem;
         --pbl: 0.47rem;
         --bg: rgba(61, 126, 146, 0.6);
         --clr: #fff;
         --border-w: 0;
         margin-top: 0;

         span {
            margin-top: 0.1rem;
         }

         box-shadow: 0 0 2px 1px rgb(0 0 0 / 0.2);

         &:hover {
            background: rgba(76, 160, 185, 0.6);

            svg {
               fill: #fff;
            }
         }
      }



   }


   [data-f] {
      display: grid;
      gap: 0.6rem;

      h3 {

         font-size: var(--size-strong, clamp(1.6rem, 1.6rem + 2vw, 1.8rem));
         font-family: var(--f-strong, 'Urbanist');
         font-weight: var(--weight-strong, 400);
      }


      p {
         font-size: 0.85em;
      }
   }



   [data-f-container] {
      display: grid;
      gap: 0.9rem;
      margin-top: 0;

      >* {
         width: 100%;
      }


      a {
         text-decoration: none;
      }


   }

   [data-f-container]:first-of-type {
      margin-top: 0.7rem;
   }

   [data-f-container]+[data-f-container] {
      margin-top: 2rem;

   }


}
</style>