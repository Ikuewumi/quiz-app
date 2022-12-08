<template>
   <div data-p data-p-quiz class="sgrid even-cols">
      <Metadata v-if="booleans.metadata" :data="quizDoc" :author="authorDoc" @editQuiz="dialogM.show('draft')"
         @takeQuiz="dialogM.show('start')" />
      <Dialog v-if="dialogM.booleans.draft" text="Draft quiz?" @no="dialogM.hide('draft')" @yes="editQuiz" />
      <Modal header="Start Quiz" :showModal="dialogM.booleans.start" @closeModal="dialogM.hide('start')">
         <form data-f-start-quiz-mode-form @submit.prevent="startQuiz">
            <label for="mode">
               <span>Difficulty</span>
               <select name="mode" v-model="modeInput">
                  <option value="easy">easy</option>
                  <option value="medium">medium</option>
                  <option value="hard">hard</option>
               </select>
            </label>

            <button>Take Quiz</button>
         </form>

      </Modal>
      <div data-p data-c-quiz v-if="booleans.quiz">
         <quiz-profile></quiz-profile>
         <section>

            <header class="dis-grid">
               <h1><span>Title: </span>Crash Corse History</h1>
               <quiz-timer></quiz-timer>
               <quiz-number></quiz-number>
            </header>

            <main>

               <quiz-question></quiz-question>
               <quiz-options></quiz-options>
               <quiz-mininav></quiz-mininav>
               <quiz-nav></quiz-nav>

            </main>

         </section>
      </div>
   </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { clientQuizMock_ } from '../../composables/_mock';
import { ClientQuiz, QuizData } from "../../composables/quizClass"
import { apiGet, apiPut } from '../../composables/auth';
import Metadata from "../../components/quiz/Metadata.vue"
import Dialog from '../../components/utitlities/Dialog.vue';
import Modal from "../../components/utitlities/Modal.vue"
import { useRoute, useRouter } from 'vue-router';
import { DocumentTypes, UserTypes } from 'types';
import { createToastPromise, useToast } from '../../composables';
import useMode from "../../pinia/mode"
const sleep = (ms = 2000) => { return (new Promise(r => setTimeout(r, ms))) };

// import { QuizNav } from '../../lit/quiz-nav';
// import { QuizNumber } from '../../lit/quiz-number';
// import { QuizOptions } from '../../lit/quiz-options';
// import { QuizProfile } from '../../lit/quiz-profile';
// import { QuizQuestion } from '../../lit/quiz-question';
// import { QuizTimer } from '../../lit/quiz-timer';
// import { QuizData } from "../"

let quizDoc = $ref({} as unknown as DocumentTypes.Quiz)
let authorDoc = $ref({} as unknown as UserTypes.ClientUserMetadata)

const modeInput = $ref('easy')

const props = defineProps({
   id: String
})


const booleans = $ref({
   quiz: false,
   metadata: false
} as { [index: string]: boolean })


const navigate = (key: "quiz" | "metadata") => {

   for (const elem in booleans) { booleans[elem] = (key === elem) }


}

const router = useRouter()



const getElements = () => {
   const quizPage = document.querySelector('div[data-p][data-c-quiz]')!


   const quizTimer = quizPage.querySelector('quiz-timer')!
   const quizOptions = quizPage.querySelector('quiz-options')!
   const quizMiniNav = quizPage.querySelector('quiz-mininav')!
   const quizNav = quizPage.querySelector('quiz-nav')!
   const quizNumber = quizPage.querySelector('quiz-number')!
   const quizQuestion = quizPage.querySelector('quiz-question')!
   const quizProfile = quizPage.querySelector('quiz-profile')!

   return {
      quizPage,
      quizTimer,
      quizOptions,
      quizMiniNav,
      quizNav,
      quizNumber,
      quizQuestion,
      quizProfile
   }

}



const dialogM = $ref({
   booleans: {
      draft: false,
      start: false
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


const editQuiz = () => {

   createToastPromise(async () => {
      console.log(qid)
      const result = await apiPut(`quiz/drafts/${qid}`, { draft: true })
      console.log(result)
      useToast().el.show(result.message, false)
      await router.push(`/admin/drafts/${qid}`)


   }, 'Drafting Quiz...', true)()



}


const qid = $computed(() => { return useRoute().params.id })



onMounted(async () => {
   // const q = new ClientQuiz(getElements(), clientQuizMock_)
   // q.init().start()

   console.log(qid)


   const r = await apiGet(`quiz/metadata/${qid}?draft=false`, true)
   quizDoc = r.quizDoc as DocumentTypes.Quiz
   authorDoc = r.authorDoc as UserTypes.ClientUserMetadata
   console.log(r)


   navigate("metadata")





})






const startQuiz = async () => {

   createToastPromise(async () => {

      // const mode = modeInput
      console.log(modeInput)
      const a = await apiGet(`quiz/${qid}?mode=${modeInput.trim().toLowerCase()}`, true) as QuizData
      console.log(a)


      dialogM.hide('start')
      navigate('quiz')
      useMode().hideHeader()
      await sleep(100)
      const q = new ClientQuiz(getElements(), a)
      q.init().start()

   }, 'Setting Quiz Up....', true)()


}

</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

div[data-c-quiz] {
   grid-column: 1 / -1;
   --col-start: 1;
   --col-width: 8;
}

div[data-c-quiz] {

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


[data-f-start-quiz-mode-form] {

   display: grid;
   row-gap: var(--size-6);
   // grid-auto-flow: column;
   place-items: center;

   label,
   .field {
      width: min(400px, 100%);
      display: flex;
      column-gap: 0.9rem;
      align-items: center;

      span {

         font-size: var(--size-strong, clamp(1ch, 1ch + 2vw, 1.1rem));
         font-family: var(--f-strong, 'Urbanist');
         font-weight: var(--weight-strong, 600);
         color: var(--clr-strong, #777);
         letter-spacing: 0.5px;
      }
   }

   button {
      @include buttons;
      --pbl: 0.8rem;
      --pin: 1.7rem;
      --border-w: 0.3px;
      --border-w-h: 0.3px;
      // justify-self: right;
   }

   input,
   textarea,
   select {
      @include card;
      @include input;
      --bg: #fff;
      --bg-h: #fff;
      --clr: #222;
      --clr-h: #222;
      border-radius: 0.2vmax;
      --pbl: 0.7rem;
      --pin: 0.7rem;
      --border-color: #00000030;
      --border-color-h: #00000060;
   }

   select {
      --pin: 0;
      --pbl: 0.5rem;
   }


}
</style>