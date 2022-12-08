<template>
   <div data-c-quiz-question-form class="sgrid even-cols" v-if="store.getCurrentQuestion">
      <header-text content="Create Question"></header-text>
      <form class="dis-grid g-5">
         <div class="img">
            <img :src="store.getCurrentQuestion.image" v-if="store.getCurrentQuestion.image! > ''" alt="">

            <span class="btn-bar">
               <button type="button" ref="editImgBtn" @click="LogicClass.showFilePicker">
                  <svg class="edit" viewBox="0 0 128 128">
                     <use href="#edit_metro"></use>
                  </svg>
               </button>

               <button type="button" v-if="store.getCurrentQuestion.image! > ''" @click="LogicClass.removeImg">
                  <svg viewBox="0 0 26 26">
                     <use href="#delete_metro"></use>
                  </svg>
               </button>
            </span>


         </div>
         <main class="dis-grid g-5">
            <input name="question" type="text" ref="questionInput" placeholder="Question" required>
            <input type="file" @change="LogicClass.showImg" ref="hiddenFileInput" accept="image/*" hidden>
            <input name="more" type="text" ref="moreInfoInput" placeholder="More info... (in markdown, optional)">
            <textarea name="options" :placeholder="textAreaPlaceholder" ref="optionsInput" required></textarea>
            <article class="form-buttons">
               <button-component role="button" @click="addNewQuestion" aria-label="button" content="New">
               </button-component>
               <button-component role="button" @click="checkSubmit" aria-label="button" content="Next">
               </button-component>
            </article>
         </main>
      </form>
   </div>
</template>

<script setup lang="ts">
import { QuizQuestionLogic } from "../../composables/quizQuestion"
import { onMounted } from "vue"
import { ReactiveVariable } from "vue/macros";
import { QuizTypes } from "types";
import { useQuizCreation } from "../../pinia/quizCreate";
import { useQuizQuestion } from "../../pinia/quizQuestion";

const props = defineProps(['doneBtn'])
const emit = defineEmits<{
   (event: 'submitForm', payload: QuizTypes.Q): void,
   (event: 'newQuestion', payload: QuizTypes.Q): void,
}>()


const refsData = useQuizQuestion()
const store = useQuizCreation()
/**@ts-ignore */
let LogicClass: ReactiveVariable<QuizQuestionLogic> = $ref(null as unknown as QuizQuestionLogic);

const hiddenFileInput = $ref(null as unknown as HTMLInputElement)
const moreInfoInput = $ref(null as unknown as HTMLInputElement)
const editImgBtn = $ref(null as unknown as HTMLButtonElement)
const questionInput = $ref(null as unknown as HTMLInputElement)
const optionsInput = $ref(null as unknown as HTMLTextAreaElement)

//COMMENT: the Logic class was null so I'm moving checksubmit into a mediator between the template and the logic class 
const checkSubmit = async () => {
   const questionData = await LogicClass.checkSubmit()
   emit('submitForm', questionData)
}

const addNewQuestion = async () => {
   const questionData = await LogicClass.checkSubmit()
   emit('newQuestion', questionData)

}


onMounted(() => {
   /**@ts-ignore */
   LogicClass = new QuizQuestionLogic(
      /**@ts-ignore */
      editImgBtn, hiddenFileInput, questionInput,
      optionsInput, moreInfoInput,
      refsData, store
   )

   LogicClass.init()
})

const textAreaPlaceholder = `List the options, separated by newlines, with the correct on being last e.g.  \nTrue\nFalse\nCorrect
`
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-quiz-question-form] {
   --col-start: 2;
   --col-width: 6;
   --img-width: 250px;

   row-gap: var(--size-4);

   .img {
      width: min(var(--img-width), 50vw);
      aspect-ratio: 1 / 1;
      background: rgb(255, 255, 255);
      outline: 1px solid rgb(0 0 0 / 0.05);
      outline-offset: -2px;
      border-radius: 0.2vmax;
      position: relative;
      overflow: hidden;

      img {
         object-fit: cover;
         width: 100%;
         height: 100%;
      }

      span.btn-bar {
         --offset: 10px;

         position: absolute;
         inset: auto auto var(--offset) var(--offset);
         display: flex;
         gap: 0.2em;

         button {

            aspect-ratio: 1 / 1;
            cursor: pointer;
            @include card;
            --pbl: 3px;
            --pin: 3px;
            --w: 35px;
            --bg: rgb(255 255 255 / 0.3);
            --bg-h: rgb(255 255 255 / 0.5);
            --fill: #222;
         }

      }
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

   textarea {
      resize: vertical;
      min-height: 140px;
   }

   .form-buttons {
      justify-self: right;
      display: flex;
      flex-wrap: wrap;
      gap: var(--size-4);
   }

   button-component {
      --pbl: 0.6rem;
      --pin: 1.8rem;
   }

   .tags {
      display: flex;
      width: fit-content;
      flex-wrap: wrap;
      place-items: center;
      cursor: pointer;
      gap: var(--size-3);

      span {
         @include card;
         flex-basis: fit-content;
         display: flex;
         place-items: center;
         gap: var(--size-5);
         --pin: 0.5rem;
      }

      span svg {
         @include mSvg;
         --w: 15px;
         --f: #555;
      }
   }

   form {
      display: grid;
   }

   @media (max-width: 800px) {}


   @media (min-width: 800px) {
      .img {
         grid-column: 1 / 2;
      }

      form {
         grid-template-columns: var(--img-width) 1fr;

         * {
            grid-column: 2 / -1;
         }
      }
   }

}
</style>