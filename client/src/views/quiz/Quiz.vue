<template>
   <div data-p data-c-quiz>
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { clientQuizMock_ } from '../../composables/_mock';
import { ClientQuiz } from "../../composables/quizClass"


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

onMounted(() => {
   const q = new ClientQuiz(getElements(), clientQuizMock_)
   q.init().start()
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
</style>