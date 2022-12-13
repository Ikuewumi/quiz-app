<template>
   <div data-p data-p-home class="sgrid even-cols">
      <quiz-hero :header="heroContent.header" :about="heroContent.content" :linkName="heroContent.linkContent"
         :link="heroContent.link"></quiz-hero>
      <div data-f-quiz-card-list v-if="pHome.state.data.length">
         <QuizCard v-for="(quiz, i) in pHome.state.data as DocumentTypes.Quiz[]" :key="i" :data="quiz!" />
      </div>
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { ApiTypes, DocumentTypes } from "types"
import { createToastPromise, title } from '../../composables';
import { apiGet } from '../../composables/auth';
import { paginate } from '../../composables/pagination';
import { useUser } from '../../pinia/user';

const QuizCard = defineAsyncComponent(() => import('../../components/quiz/QuizCard.vue'))
const router = useRouter()
const user = useUser()




const heroContent = $computed(() => {

   const normalObject = {
      'header': 'Let\'s Quiz',
      'content': 'Sign up to start up',
      'link': '/auth',
      'linkContent': 'get started'
   }

   if (user._id) {
      normalObject['content'] = `Welcome back, ${user.name}`
      normalObject['link'] = '/you'
      normalObject['linkContent'] = 'to user page'
   }

   return normalObject

})


const quizHeroM = {
   addListener() { this.el.addEventListener('btnClick', _ => { router.push(heroContent.link) }) },
   removeListener() { this.el.removeEventListener('btnClick', _ => { }) },

   get el() {
      return document.querySelector('quiz-hero')!
   }
}



const pHome = paginate('lists/home?', 20, false)




onMounted(() => {
   quizHeroM.addListener()
   title('Home Page')

   createToastPromise(async () => {

      await pHome.value.start()

   }, 'Loading Quizzes', true)()
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