<template>
   <div data-p data-p-quizzes class="sgrid even-cols">
      <div data-f-tag-list>
         <Tag v-for="(tag, i) in HintTags" :content="tag" :key="i" />
      </div>


      <div data-f-quiz-card-list v-if="pQuizzes.state.data.length">
         <QuizCard v-for="(quiz, i) in pQuizzes.state.data as DocumentTypes.Quiz[]" :key="i" :data="quiz!" />
      </div>


      <PaginationBar :showMore="pQuizzes.computedShouldShowMore" :text="pQuizzes.computedText"
         @showMore="pQuizzes.promiseNextPage" />
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onBeforeUnmount, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { HintTags, title } from '../../composables';
import { ApiTypes, DocumentTypes } from "types"
import { createToastPromise } from '../../composables';
import { apiGet } from '../../composables/auth';
import { paginate } from '../../composables/pagination';
const PaginationBar = defineAsyncComponent(() => import('../../components/utitlities/PaginationBar.vue'))
const QuizCard = defineAsyncComponent(() => import('../../components/quiz/QuizCard.vue'))
const Tag = defineAsyncComponent(() => import('../../components/utitlities/Tag.vue'))
const router = useRouter()




const pQuizzes = paginate('lists/quizzes?', 20, false)

const toNextPage = () => {
   createToastPromise(async () => {
      await pQuizzes.value.nextPage()
   }, 'Loading more quizzes....', true)
}


onMounted(() => {
   createToastPromise(async () => {

      title('Quizzes Page')
      await pQuizzes.value.start()

   }, 'Loading Quizzes', true)()
})







onBeforeUnmount(() => {
})

</script>

<style lang="scss">
[data-p-quizzes] {

   --col-start: 2;
   --col-width: 6;

   row-gap: var(--size-6);


   >* {
      grid-column: 2/ -2;
   }




   [data-f-tag-list] {

      // --w-tag-list: min(600px, 100%);
      --size-tag: 13px;
      margin: 0 auto;

   }

}
</style>