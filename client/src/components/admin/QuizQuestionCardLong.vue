<template>
   <div data-c-question-card-long class="dis-flex" v-if="!props.isBar">
      <span class="question">
         <span class="num">{{ props.index }}</span>
         <span class="q">{{ props.question.q }}</span>
      </span>
      <span class="btn-bar">

         <button type="button" style="--f-h: #60ace9" @click="emit('previewQuestion')">
            <svg viewBox="0 0 26 26">
               <use href="#preview_question_metro"></use>
            </svg>
         </button>

         <button type="button" style="--f-h: #6c99ae" @click="emit('editQuestion')">
            <svg class="edit" viewBox="0 0 128 128">
               <use href="#edit_metro"></use>
            </svg>
         </button>

         <button type="button" style="--f-h: #ef5350" @click="emit('deleteQuestion')">
            <svg viewBox="0 0 26 26">
               <use href="#delete_metro"></use>
            </svg>
         </button>

      </span>
   </div>

   <div data-c-question-card-long class="dis-flex bar" v-else>
      <span class="question">
         <!-- <span class="num">1</span> -->
         <span class="q">All Questions</span>
      </span>
      <span class="btn-bar">

         <button type="button" style="--f-h: #60ace9" @click="emit('createQuestion')">
            <svg viewBox="0 0 26 26">
               <use href="#plus_metro"></use>
            </svg>
         </button>

      </span>
   </div>
</template>

<script setup lang="ts">
import { Option } from '../../lit/quiz-options';
import { onMounted } from 'vue';
import { QuizTypes } from "types"

const props = defineProps({
   question: {
      default: {
         "q": "Just got engaged",
         "options": ["trey", "desire"]
      } as QuizTypes.Q
   },

   index: {
      default: 1,
   },

   isBar: {
      type: Boolean,
      default: false
   }
})

const emit = defineEmits<{
   (event: 'createQuestion'): void,
   (event: 'editQuestion'): void,
   (event: 'previewQuestion'): void,
   (event: 'deleteQuestion'): void
}>()


onMounted(() => {
   // optionEl.options = getOptions

}) 
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-question-card-long] {

   &.bar {
      --bg: transparent;
      --bg-h: transparent;

      .q {
         font-family: var(--f-h1, 'Urbanist');
         font-size: clamp(1.3rem, 1.3rem + 3vw, 1.5rem);
      }
   }


   word-break: break-all;
   align-items: center;
   align-content: center;
   width: var(--p-w, 100%);
   @include card;
   --pin: 1rem;
   --pbl: 0.6rem;
   --bg: #fff;
   --bg-h: #fff;
   --br: 0.4vmax;
   --border-w: 0;
   --border-w-h: 0;

   & {
      box-shadow: 0 0 1px 0 rgb(0 0 0 / 0.03)
   }

   span.question {

      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--question-g, 0.6rem);


      span.num {
         font-family: var(--f-num, 'Urbanist');
         font-size: var(--size-num, clamp(1.2rem, 1.2rem + 2vw, 1.5rem));
         font-weight: var(--weight-num, 700);
      }

   }


   @media (min-width: 500px) {
      justify-content: space-between;
   }


   @media (max-width: 500px) {
      flex-direction: column;
      align-items: normal;
      align-content: normal;
      row-gap: 0.4rem;

      &.bar {
         flex-direction: row;

      }


      span.question {
         width: 100%;
         justify-self: left;
         justify-content: left;
      }

      span.btn-bar {
         width: 100%;
         justify-self: right;
         justify-content: right;
      }
   }





   span.btn-bar {
      --offset: 10px;
      justify-self: right;
      // position: absolute;
      // inset: auto auto var(--offset) var(--offset);
      display: flex;
      gap: 0.2em;

      button {

         aspect-ratio: 1 / 1;
         cursor: pointer;
         @include card;
         @include mSvg;
         --pbl: 3px;
         --pin: 3px;
         --w: 30px;
         --bg: rgb(255 255 255 / 0.3);
         --bg-h: rgb(255 255 255 / 0.5);
         --f: #888;
      }

   }
}
</style>