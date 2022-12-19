<template>
   <div data-p data-p-quiz class="sgrid even-cols">
      <Metadata v-if="booleans.metadata" :data="quizDoc" :author="authorDoc" @editQuiz="dialogM.show('draft')"
         @takeQuiz="dialogM.show('start')" />

      <Dialog v-if="dialogM.booleans.draft" text="Draft quiz?" @no="dialogM.hide('draft')" @yes="editQuiz"
         :showDialog="dialogM.booleans.draft" />

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

      <QuizComponent @submitAnswers="submitFunc" :data="quizDataDoc" :startQuiz="booleans.quiz" v-if="booleans.quiz" />

      <PostQuizComponent :data="markedQuizData" v-if="booleans.postquiz" @to-correction="checkCorrection"
         @to-metadata="navigate('metadata')" />

      <div class="dis-grid p-center" v-if="booleans.correction">
         <QuizCorrectionCard @stop-preview="navigate('metadata')" :data="correctionM.current"
            @next-question="correctionM.nav(true)" @prev-question="correctionM.nav(false)" />
      </div>

   </div>

</template>

<script setup lang="ts">
import { onMounted, watch, defineAsyncComponent, computed, ref } from 'vue';
import type { QuizData } from "../../composables/quizClass"
import { apiGet, apiPost, apiPut } from '../../composables/auth';
import Metadata from "../../components/quiz/Metadata.vue"
import Dialog from '../../components/utitlities/Dialog.vue';
import Modal from "../../components/utitlities/Modal.vue"
import { useRoute, useRouter } from 'vue-router';
import { DocumentTypes, QuizTypes, UserTypes } from 'types';
import { createToastPromise, useToast, sleep, title } from '../../composables';
import useMode from "../../pinia/mode"
import { z } from 'zod';
import { zClientQuiz, zClientQuizForCorrection, zClientQuizWithQuestions, zQuizMetadataExtra, zTimeMode } from '../../composables/validator';
import { useUser } from '../../pinia/user';
const QuizComponent = defineAsyncComponent(() => import('../../components/quiz/Quiz.vue'))
const PostQuizComponent = defineAsyncComponent(() => import('../../components/quiz/PostQuiz.vue'))
const QuizCorrectionCard = defineAsyncComponent(() => import('../../components/quiz/QuizCorrectionCard.vue'))

let quizDoc = $ref(null as unknown as DocumentTypes.Quiz)
let authorDoc = $ref(null as unknown as UserTypes.ClientUserMetadata)
let quizDataDoc = $ref(null as unknown as QuizData)
let markedQuizData = $ref(null as unknown as QuizTypes.MarkedQuiz)
let correctionOptions = $ref(null as unknown as QuizTypes.Q[])
let currentCorrection = $ref(null as unknown as QuizTypes.Q)


const correctionM = ref({
   state: {
      index: -1,
      data: [] as QuizTypes.Q[]
   },

   nav(toNext: boolean) {
      let i = this.state.index
      if (toNext) {
         if ((this.state.data.length - 1) <= i) this.state.index = 0
         else this.state.index += 1
      } else {
         if ((i - 1) < 0) this.state.index = this.state.data.length - 1
         else this.state.index -= 1
      }

   },

   goto(i: number) { this.state.index = i },

   get current() {
      return computed(() => this.state.data[this.state.index])
   }

})


const modeInput = $ref('easy')
const router = useRouter()
const props = defineProps(['id'])
const qid = $computed(() => useRoute().params.id)
const user = useUser()


const booleans = $ref({
   quiz: false,
   metadata: false,
   postquiz: false,
   correction: false
} as { [index: string]: boolean })


const navigate = (key: "quiz" | "metadata" | "postquiz" | "correction") => {

   for (const elem in booleans) { booleans[elem] = (key === elem) }


}


const dialogM = $ref({
   booleans: {
      draft: false,
      start: false,
      submit: false
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
      const result = await apiPut(`quiz/drafts/${qid}`, { draft: true })
      useToast().el.show(result.message, false)
      await router.push(`/admin/drafts/${qid}`)


   }, 'Drafting Quiz...', true)()



}



onMounted(async () => {
   // const q = new ClientQuiz(getElements(), clientQuizMock_)
   // q.init().start()

   createToastPromise(async () => {
      const r = await apiGet(`quiz/metadata/${qid}?draft=false`, false)
      quizDoc = r.quizDoc as DocumentTypes.Quiz
      authorDoc = r.authorDoc as UserTypes.ClientUserMetadata
      title(`Quiz | ${quizDoc.title}`)


      navigate("metadata")
   }, 'Loading quiz metadata...', true)()







})



watch(booleans, (newVal, oldVal) => {
   //make sure that the header dosen't show in `QUIZ` mode
   const func = !!(newVal['quiz']) ? useMode().hideHeader : useMode().showHeader
   func()

})






const startQuiz = async () => {

   createToastPromise(async () => {

      const apiQuiz = await apiGet(`quiz/${qid}?mode=${modeInput.trim().toLowerCase()}`, false)

      quizDataDoc = {
         ...zTimeMode.strip().parse(apiQuiz),
         questionsDoc: { data: apiQuiz['questions'] },
         quizDoc: zQuizMetadataExtra.strip().parse(apiQuiz),
         userDoc: apiQuiz['userDoc']
      }




      dialogM.hide('start')
      navigate('quiz')
      await sleep(100)


   }, 'Setting Quiz Up....', true)()


}


const checkCorrection = async () => {

   createToastPromise(async () => {


      let correction: any;

      if (user?._id) { correction = await apiGet(`quiz/correction/${qid}`, true) }
      else { correction = await apiGet(`quiz/correction/${qid}`, false) }

      correctionM.value.state.data = zClientQuizForCorrection.pick({ "questions": true }).strip().parse(correction).questions
      correctionM.value.goto(0)
      navigate('correction')

   }, 'Loading Correction', true)()


}




const submitFunc = (answers: QuizTypes.Answer) => {

   createToastPromise(async () => {
      if (user?._id) { markedQuizData = await apiPost(`quiz/mark/${qid}`, answers, true) as QuizTypes.MarkedQuiz }
      else { markedQuizData = await apiPost(`quiz/mark/${qid}`, answers, false) as QuizTypes.MarkedQuiz }
      navigate("postquiz")



   }, 'Submittin quiz', true)()



}




const selectCorrection = (i: number) => { currentCorrection = correctionOptions[i] }


</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;


div[data-c-quiz] {

   height: 100vh;
   display: grid;
   gap: 0.3em;
   --sidebar-width: 250px;

   &#quiz-page {
      grid-column: 1/ -1;
   }

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
      --gap: 0.2rem;
      --pbl: 1.5rem;
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