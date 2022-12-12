<template>
   <div data-c-post-quiz class="mb-9">
      <Score data-pq-score :percent="((props.data.scoreData.score / props.data.scoreData.total) * 100)" />
      <span role="link" data-link-to-metadata @click="emit('toMetadata')">Back To Metadata</span>
      <button v-if="props.data.quizDoc?.showCorrection" role="link" data-link-to-correction
         @click="emit('toCorrection')">To Correction</button>
   </div>
</template>

<script setup lang="ts">
import Score from './Score.vue';
import { QuizTypes } from 'types';

const emit = defineEmits<{
   (event: 'toMetadata'): void,
   (event: 'toCorrection'): void,
}>()

const props = defineProps({
   data: {
      default: null as unknown as QuizTypes.MarkedQuiz
   }
})
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-post-quiz] {
   width: 100%;
   display: grid;
   place-items: center;
   row-gap: var(--size-7);

   [data-pq-score][data-c-score] {
      --svg-w: min(200px, 50vw);
      --percent: 0;
      --full-offset: 440px;
      --clr-score: rgb(37, 140, 209);
   }



   [data-link-to-metadata] {
      color: var(--c, var(--clr-dlue));
      font-size: var(--f-size-s0);
      font-weight: 500;
      font-family: 'Urbanist';
      text-decoration: none;
      position: relative;
      line-height: .8;
      cursor: pointer;

      &::before {
         content: '';
         position: absolute;
         inset: auto auto 0 0;
         width: 100%;
         height: 0.5px;
         background: var(--c, var(--clr-dlue));
         transition: 0.4s ease;
         opacity: 0.6;


      }


      &:hover::before {
         height: 5px;
      }
   }




   [data-link-to-correction] {
      @include buttons;
      --pbl: 0.8rem;
      --pin: 1.7rem;
      --border-w: 0.3px;
      --border-w-h: 0.3px;
      margin-top: var(--size-3);
   }






}
</style>