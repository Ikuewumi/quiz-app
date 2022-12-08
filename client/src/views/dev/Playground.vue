<template>
   <div data-p class="sgrid even-cols p-center" data-c-playground>

      <Metadata />
      <!-- <div data-f-quiz-card-list>
         <QuizCard />
         <QuizCard />
      </div>
      <QuizCard /> -->
      <Dialog :showDialog="showDialog" @no="showDialog = false" @yes="showDialog = false" text="A Dummy Dialog" />


   </div>
</template>

<script setup lang="ts">
import QuizCard from '../../components/quiz/QuizCard.vue';
import Dialog from '../../components/utitlities/Dialog.vue';
import Metadata from '../../components/quiz/Metadata.vue';

const a = (...args: any[]) => console.log(args)

const showDialog = $ref(true)
</script>

<style lang="scss">
[data-c-playground] {
   --col-start: 2;
   --col-width: 6;

   row-gap: var(--size-6);


   &>* {
      grid-column: 2/ -2
   }
}

[data-f-quiz-questions-bar] {}
</style>