<template>
   <div data-p data-p-user class="sgrid even-cols">
      <Metadata :showEdit="false" :user="metadataDoc" v-if="metadataDoc" />

      <section data-f-container v-if="(publishedQuizzes.state.data.length && metadataDoc?.admin)">
         <div data-f>
            <h3>Published</h3>
            <p>Here you can see and take quizzes made by this user</p>
         </div>
         <div class="dis-grid g-6">
            <div data-f-quiz-card-list>
               <QuizCard v-for=" (quiz, i) in (publishedQuizzes.state.data as DocumentTypes.Quiz[])" :key="i"
                  :data="quiz" />
            </div>
            <PaginationBar :showMore="publishedQuizzes.computedShouldShowMore" :text="publishedQuizzes.computedText"
               @show-more="publishedQuizzes.promiseNextPage" />
         </div>
      </section>
   </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { createToastPromise, title } from '../../composables';
import Metadata from '../../components/user/Metadata.vue';
import { useRouter, useRoute } from 'vue-router';
import { apiGet } from '../../composables/auth';
import { ApiTypes, AuthTypes, DocumentTypes, QuizTypes, UserTypes } from 'types';
import { paginate } from '../../composables/pagination';
const QuizCard = defineAsyncComponent(() => import('../../components/quiz/QuizCard.vue'))
const PaginationBar = defineAsyncComponent(() => import('../../components/utitlities/PaginationBar.vue'))

const route = useRoute()

const qid = $computed(() => route.params.id)

let publishedQuizzes = paginate(`lists/user/quizzes/${qid}?`, 20, false)
let metadataDoc = $ref(null as unknown as UserTypes.UserMetadata)



onMounted(() => {


   createToastPromise(async () => {
      await publishedQuizzes.value.start()
      metadataDoc = await apiGet(`user/metadata/${qid}`, false)
      title(`${metadataDoc.name} | Profile`)

   }, 'Loading User Data', false)()


})
</script>

<style lang="scss">
[data-p-user] {

   --col-start: 2;
   --col-width: 6;
   row-gap: var(--size-6);


   >* {
      grid-column: 2 / -2;
   }

}
</style>