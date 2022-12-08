<template>
   <div data-p data-p-home class="sgrid even-cols">
      <quiz-hero header="lorem" about="lorem ipsum" linkName="continue" :link="heroLink"></quiz-hero>
      <div data-f-quiz-card-list v-if="quizzes">
         <QuizCard v-for="(quiz, i) in quizzes.data" :key="i" :data="quiz!" />
      </div>
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ApiTypes, DocumentTypes } from "types"
import { createToastPromise } from '../../composables';
import { apiGet } from '../../composables/auth';

const QuizCard = defineAsyncComponent(() => import('../../components/quiz/QuizCard.vue'))
const router = useRouter()
//TODO chage b4 prod.
const heroLink = $ref('/user')
let quizzes = $ref(null as unknown as ApiTypes.PaginatedData<DocumentTypes.Quiz>)



const quizHeroM = {
   addListener() { this.el.addEventListener('btnClick', _ => { router.push(heroLink) }) },
   removeListener() { this.el.removeEventListener('btnClick', _ => { }) },

   get el() {
      return document.querySelector('quiz-hero')!
   }
}



const getQuizzes = async () => {
   createToastPromise(async () => {

      const r = await apiGet(`lists/home?page=1`)
      quizzes = r as ApiTypes.PaginatedData<DocumentTypes.Quiz>
      console.log(r)


   }, 'Loading Quizzes', true)()
}




onMounted(() => {
   quizHeroM.addListener()
   getQuizzes()
})







onBeforeUnmount(() => {
   quizHeroM.removeListener()
})

</script>

<style lang="scss">
[data-p-home] {

   --col-start: 2;
   --col-width: 6;

   row-gap: var(--size-6);


   >* {
      grid-column: 2/ -2;
   }

}


quiz-hero {
   --h: 400px;
   --w: 100%;
   --border-width: 0;
   --border-radius: 1vmax;
   --p-bg: rgba(151, 194, 223, 0.705);
   --p-g: 1.3rem;
   --g-header: 1rem;
   --bg: rgb(0 0 0 / 0.1);
   --pbl: 0.6rem;
   --pin: 1.8rem;
   //  justify-self: right;

}
</style>