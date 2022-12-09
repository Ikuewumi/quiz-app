<template>
   <div data-c-quiz-question-card>
      <!-- <header-text content="dj"></header-text> -->
      <quiz-question ref="questionEl"></quiz-question>
      <quiz-options ref="optionEl"></quiz-options>
      <div class="btn-bar">
         <button type="button" style="--j: left" @click="emit('prevQuestion')">
            <svg viewBox="0 0 26 26">
               <use href="#left_metro"></use>
            </svg>

         </button>

         <button type="button" style="--j: right" class="" @click="emit('nextQuestion')">
            <svg viewBox="0 0 26 26">
               <use href="#right_metro"></use>
            </svg>

         </button>
      </div>
      <button type="button" class="stop_btn" @click="emit('stopPreview')">
         <svg viewBox="0 0 26 26">
            <use href="#delete_metro"></use>
         </svg>
      </button>
   </div>
</template>

<script setup lang="ts">
import { useQuizCreation } from '../../pinia/quizCreate';
import { Option } from '../../lit/quiz-options';
import { onMounted } from 'vue';
import { QuizTypes } from "types"
// import { ClientMdLib } from 'md';

const emit = defineEmits<{
   (event: 'stopPreview'): void,
   (event: 'nextQuestion'): void,
   (event: 'prevQuestion'): void,
}>()

const optionEl = $ref(null as unknown as HTMLElementTagNameMap["quiz-options"])
const questionEl = $ref(null as unknown as HTMLElementTagNameMap["quiz-question"])

const store = useQuizCreation()


const getProcessedOptions = (options: string[]) => {
   const processed = options.map((option, i, array) => {
      const obj: Option = { option }
      if (i === array.length - 1) obj.on = true
      return obj
   })
   return processed
}

const fillFields = async (questionObject: QuizTypes.ClientQuestion) => {

   questionEl.question = questionObject.q
   optionEl.options = getProcessedOptions(questionObject.options)
   let slotMarkup = ``
   if (questionObject?.info! > '') {
      const { ClientMdLib } = await import("md")
      const md = await ClientMdLib.mdToHtml(questionObject?.info!)
      slotMarkup += md
   }

   if (questionObject?.image! > '') {
      const imgHTML = `<img src=${questionObject.image} alt>`
      slotMarkup += imgHTML
   }

   questionEl.innerHTML = slotMarkup
}

const fill = () => {
   if (store.getCurrentQuestion && typeof store.getCurrentQuestion?.q === 'string') {
      fillFields(store.getCurrentQuestion!)
   } else {
      fillFields({ q: "No World", options: ["true", "false"] })
   }
}




onMounted(() => {
   fill()

   store.$subscribe(() => {
      fill()
   })
})
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-quiz-question-card] {
   --p-w: min(500px, 100%);
   --w: 100%;
   --pbl: 0.5rem;
   --gp: 0;
   --bg: rgb(0 0 0 / 0);
   --p-gap: 0 0.6rem;
   --p-pbl: 1rem 1.7rem;
   --p-gp: clamp(0.1rem, 0.5rem + 3vw, 0.8rem);
   --p-bg: rgb(255, 255, 255);
   --p-br: 0.5vmax;

   padding-block: var(--p-pbl);
   width: var(--p-w);
   background-color: var(--p-bg);
   border-radius: var(--p-br);
   box-shadow: 0 0 1px rgb(0 0 0 / 0.2);
   position: relative;
   display: grid;
   gap: var(--p-gap);
   grid-template-columns: minmax(var(--p-gp), 1fr) minmax(0, 800px) minmax(var(--p-gp), 1fr);

   &>* {
      grid-column: 2/ -2;
   }

   quiz-question {
      --gap: 0.6rem;
      --size: 0.9rem;

      img {
         max-width: 60%;
      }
   }


   button-component {
      --size: 1.2rem;
      --border-w: 1px;
      --border-color: rgb(0 0 0 / 0.1);
      justify-self: right;
   }

   button.stop_btn {
      position: absolute;
      inset: 0 0 auto auto;
      aspect-ratio: 1 / 1;
      cursor: pointer;
      @include card;
      @include mSvg;
      --f: var(--clr-red);
      --f-h: var(--clr-light);
      --pbl: 3px;
      --pin: 3px;
      --w: 35px;
      --bg: rgb(255 255 255 / 0.3);
      --bg-h: var(--clr-red);
      --fill: #222;
      --border-w: 0.1px;
      --border-color-h: rgb(0 0 0/ 0.1);
   }

   .btn-bar {
      display: grid;
      align-items: normal;
      justify-content: space-between;
      gap: var(--g, var(--size-3));
      grid-auto-flow: column;
      width: var(--w, 100%);
      margin-top: var(--size-4);
      margin-bottom: var(--size-5);

      button {

         justify-self: var(--j, left);

         cursor: pointer;
         @include grid-column;
         align-items: center;
         @include card;
         --g: 0rem;
         --pbl: 0.4rem;
         --pin: 0.8rem 0.95rem;
         --br: 0.2vmax;
         --bg: rgb(0 0 0 / 0.002);

         svg {

            @include mSvg;
            aspect-ratio: 1 / 1;
            --f: var(--clr-dlue);
            --f-h: var(--clr-light);
            --bg: transparent;
            --bg-h: transparent;
            --w: 30px;
         }

         --bg: rgb(255 255 255 / 0.3);
         --bg-h: var(--clr-dlue);
         --fill: #222;
         --border-w: 0.1px;
         --border-color-h: rgb(0 0 0/ 0.1);

         &:hover {
            color: var(--clr-light);

            svg {

               --f: var(--clr-light);
            }
         }
      }
   }

}
</style>