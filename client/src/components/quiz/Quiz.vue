<template>
   <div id="quiz-page" ref="quizEls.quizPage" v-if="props.startQuiz" data-p data-c-quiz>
      <quiz-profile ref="quizEls.quizProfile"></quiz-profile>
      <section>

         <header class="dis-grid">
            <h1><span>Title: </span>{{ props.data.quizDoc.title }}</h1>
            <quiz-timer ref="quizEls.quizTimer"></quiz-timer>
            <quiz-number ref="quizEls.quizNumber"></quiz-number>
         </header>

         <main>

            <quiz-question ref="quizEls.quizQuestion"></quiz-question>
            <quiz-options ref="quizEls.quizOptions"></quiz-options>
            <quiz-mininav ref="quizEls.quizMiniNav"></quiz-mininav>
            <quiz-nav ref="quizEls.quizNav"></quiz-nav>

         </main>

      </section>


      <Dialog v-if="dialogM.booleans.submit" :showDialog="dialogM.booleans.submit" @yes="submitQuiz" text="Submit Quiz?"
         @no="dialogM.hide('submit')" />
   </div>
</template>

<script setup lang="ts">
import { QuizTypes } from 'types';
import { onMounted, defineAsyncComponent, onBeforeUnmount } from 'vue';
import { useToast } from '../../composables';
import { QuizData, ClientQuiz } from '../../composables/quizClass';
const Dialog = defineAsyncComponent(() => import('../../components/utitlities/Dialog.vue'))

const props = defineProps({
   data: {
      default: null as unknown as QuizData
   },

   startQuiz: { default: false }
})

const emit = defineEmits<{
   (event: 'submitAnswers', payload: QuizTypes.ClientAnswer): void
}>()



let LogicClass = $ref(null as unknown as ClientQuiz)
let answers = $ref(null as unknown as QuizTypes.ClientAnswer)




const dialogM = $ref({
   booleans: {
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




const els = $computed(() => {

   const quizPage = document.querySelector('#quiz-page') as HTMLDivElement


   return {
      quizPage,
      quizTimer: quizPage.querySelector('quiz-timer')!,
      quizOptions: quizPage.querySelector('quiz-options')!,
      quizMiniNav: quizPage.querySelector('quiz-mininav')!,
      quizNav: quizPage.querySelector('quiz-nav')!,
      quizNumber: quizPage.querySelector('quiz-number')!,
      quizQuestion: quizPage.querySelector('quiz-question')!,
      quizProfile: quizPage.querySelector('quiz-profile')!
   }







})







const startQuiz = () => {
   const a = { ...els }
   LogicClass = new ClientQuiz(a, props.data)
   LogicClass.init().start()

   els.quizPage.addEventListener('quiz-submit', (e) => {
      answers = e.detail.answers
      if (LogicClass.timeIsRunning) {
         dialogM.show('submit')
      } else {
         useToast().el.show('Time is up! submitting answers')
         submitQuiz()
      }
   })
}

const submitQuiz = () => {
   emit('submitAnswers', answers)

}


onMounted(() => startQuiz())
onBeforeUnmount(() => {
   LogicClass.removeListeners()
   LogicClass = null as unknown as ClientQuiz
})

</script>

<style lang="scss">
div[data-c-quiz] {

   height: 100vh;
   display: grid;
   gap: 0.3em;
   --sidebar-width: 250px;
   background: #fff;

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
      font-size: clamp(12px, 12px + 1vw, 2ch);
      font-weight: 600;
      color: #777;



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

   quiz-mininav,
   quiz-nav,
   quiz-number {
      --br: 10vmax;
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
</style>