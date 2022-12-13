<template>
   <div data-p data-p-quiz class="sgrid even-cols">
      <Metadata v-if="booleans.metadata" :data="quizMetadata" :author="authorDoc" @publishQuiz="metadataM.showConfirm"
         @deleteQuiz="metadataM.showDeleteConfirm" @editQuiz="metadataM.toEditPage" />
      <!-- <Modal v-if="booleans.modal" @close-modal="navigate('quiz')" header=""></Modal> -->
      <Dialog v-if="booleans.modal" @no="booleans.modal = false" @yes="metadataM.publish"
         text="Publish this drafted quiz?" />
      <Dialog v-if="booleans.deleteModal" @no="booleans.deleteModal = false" @yes="metadataM.delete"
         text="Delete this drafted quiz?" />
   </div>

</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { title } from "../../composables"
import { apiDelete, apiGet } from '../../composables/auth';
import Metadata from "../../components/quiz/Metadata.vue"
import { useRoute, useRouter } from 'vue-router';
import { DocumentTypes, UserTypes } from 'types';
import { createToastPromise, useToast } from '../../composables';
import { apiPut } from '../../composables/auth'
const Dialog = defineAsyncComponent(() => import('../../components/utitlities/Dialog.vue'))


const props = defineProps(['id'])


const booleans = $ref({
   quiz: false,
   metadata: false,
   modal: false,
   deleteModal: false
} as { [index: string]: boolean })

let quizMetadata = $ref({} as DocumentTypes.Quiz)
let authorDoc = $ref({} as unknown as UserTypes.ClientUserMetadata)

const navigate = (key: "quiz" | "metadata") => {

   for (const elem in booleans) { booleans[elem] = (key === elem) }


}

const qid = $computed(() => { return useRoute().params.id })
const router = useRouter()









const metadataM = $ref({

   showConfirm() {
      booleans.modal = true
   },

   toEditPage() {
      return router.push(`/admin/update/${qid}`)
   },


   showDeleteConfirm() {
      booleans.deleteModal = true
   },



   async delete() {
      createToastPromise(async () => {
         const result = await apiDelete(`quiz/${qid}`)
         useToast().el.show(result.message, false)

         await router.push('/admin')

      }, 'Deleting quiz...', true)()
   },



   async publish() {


      createToastPromise(async () => {
         const result = await apiPut(`quiz/drafts/${qid}`, { draft: false })
         useToast().el.show(result.message, false)
         await router.push(`/quiz/${qid}`)


      }, 'Publishing Quiz', true)()



   }



})










onMounted(async () => {

   createToastPromise(async () => {
      const quizMetadata_ = await apiGet(`quiz/metadata/${qid}?draft=true`, true)
      quizMetadata = quizMetadata_.quizDoc as DocumentTypes.Quiz
      title(`Drafts - ${quizMetadata.title}`)
      authorDoc = quizMetadata_.authorDoc as UserTypes.ClientUserMetadata
      navigate("metadata")

   }, 'Loading Draft Data...', true)()








})

</script>

<style lang="scss">
[data-c-quiz] {

   height: 100vh;
   display: grid;
   gap: 0.3em;
   --sidebar-width: 250px;

   @media (min-width: 800px) {
      grid-template-columns: var(--sidebar-width) 1fr;
   }

   @media(max-width: 800px) {
      quiz-profile {
         display: none;
      }
   }

   quiz-profile {
      --w: var(--sidebar-width);
      position: fixed;
      inset: 0 auto 0 0;
   }

   h1 {
      font-family: var(--f-big);
      font-size: clamp(10px, 10px + 1vw, 2ch);
      font-weight: 200;


      span {
         font-weight: 400;
      }
   }

   quiz-timer {

      position: fixed;
      inset: 0 0 auto auto;
      transform: translate(-25%, 10%);

   }



   quiz-number,
   quiz-mininav {

      --w: fit-content;
      --size: clamp(15px, 15px + 1vw, 2.3ch);


   }

   quiz-mininav {
      --size: clamp(15px, 15px + 1vw, 2ch);
      --size-btn: clamp(15px, 15px + 1vw, 2.3ch);
   }

   quiz-number {
      --size: clamp(15px, 15px + 1vw, 1.7ch);

   }

   quiz-question,
   quiz-options,
   quiz-nav {

      --w: 100%;
      --bg: transparent;
      --w-img: 200px;
      --gp: 1.5rem;


   }

   quiz-question {
      --pbl: 1.5rem 0;
   }

   quiz-nav {
      --size: 13px;
      --w-span: 25px;
      --pbl: 0.5rem;
      --br: 50%;
   }

   quiz-mininav {
      --pbl: 2rem 1rem;
   }


   quiz-question {
      --size-h1: clamp(1.1rem, 1.1rem + 1vw, 4ch);
   }

   quiz-options {
      --pbl: 0;
   }

   header {
      padding-block-start: 1rem;
      row-gap: 0.8rem;
      display: grid;
      grid-template-columns: minmax(var(--gp, 1.7em), 1fr) minmax(0, var(--w-c, 800px)) minmax(var(--gp, 1.7em), 1fr);

      &>* {
         grid-column: 2 / -2;
      }
   }

   section {

      grid-column: 2 / -1;
      width: 100%;
      height: 100%;

   }



}

[data-p-quiz] {
   --col-start: 2;
   --col-width: 6;
   row-gap: var(--size-6);

   >* {
      grid-column: 2 / -2;
   }
}
</style>