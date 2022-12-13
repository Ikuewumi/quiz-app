<template>
   <div data-c-quiz-meta-form data-p class="sgrid even-cols">
      <header-text content="Enter Quiz Metadata"></header-text>
      <form class="dis-grid g-5">
         <div class="img">
            <img :src="imgRef" v-if="imgRef > ''" alt="">

            <span class="btn-bar">
               <button type="button" ref="editImgBtn" @click="LogicClass.showFilePicker">
                  <svg class="edit" viewBox="0 0 128 128">
                     <use href="#edit_metro"></use>
                  </svg>
               </button>

               <button type="button" v-if="imgRef > ''" @click="removeImg">
                  <svg viewBox="0 0 26 26">
                     <use href="#delete_metro"></use>
                  </svg>
               </button>
            </span>


         </div>
         <main class="dis-grid g-5">
            <input name="title" ref="titleInput" type="text" placeholder="Title" required>
            <input type="file" @change="showImg" accept="image/*" ref="hiddenFileInput" hidden>

            <textarea name="description" ref="descriptionInput" placeholder="Description (at least 30 characters)"
               required></textarea>


            <div data-select-bar>

               <select v-model="toShowCorrection" name="showCorrection" ref="showCorrectionInput">
                  <option value="Do you want to show correction after the quiz?" disabled>
                     Do you want to show correction after the quiz?
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
               </select>

               <select v-model="tag" name="tag" ref="tagsInput">
                  <option value="docs" disabled>
                     Choose a topic this quiz specializes in
                  </option>
                  <option v-for="(tag, i) in HintTags" :key="i" :value="tag">{{ tag }}</option>
               </select>

            </div>


            <!-- //TODO change the tag system and allow only one tag -->

            <button-component @click="checkSubmit" role="button" aria-label="button" :content="props.doneBtn">
            </button-component>
         </main>
      </form>
   </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue"
import { QuizTypes } from "types";
import { ReactiveVariable } from "vue/macros";
import { useQuizMetadataData } from "../../pinia/quizMetadata";
import { QuizMetadataLogic } from "../../composables/quizMetadata";
import { useQuizCreation } from "../../pinia/quizCreate"
import { HintTags } from "../../composables/index"

const props = defineProps({
   doneBtn: {
      default: 'Next'
   }
})
const emit = defineEmits<{
   (event: 'submitForm', payload: QuizTypes.QuizMetadata): void
}>()

let imgRef = $ref('')
const store = useQuizCreation()
/**@ts-ignore */
let LogicClass: ReactiveVariable<QuizMetadataLogic> = $ref(null as unknown as QuizMetadataLogic)


const hiddenFileInput = ref(null as unknown as HTMLInputElement)
const tagsInput = ref(null as unknown as HTMLSelectElement)
const showCorrectionInput = ref(null as unknown as HTMLSelectElement)
const editImgBtn = ref(null as unknown as HTMLButtonElement)
const titleInput = ref(null as unknown as HTMLInputElement)
const descriptionInput = ref(null as unknown as HTMLTextAreaElement)


let toShowCorrection = $ref('no')
let tag = $ref('medicine')


//COMMENT: the Logic class was null so I'm moving checksubmit into a mediator between the template and the logic class 
const checkSubmit = async () => {
   const metadata = await LogicClass.checkSubmit(imgRef)

   emit('submitForm', metadata)
}

const showImg = async () => {
   imgRef = await LogicClass.showImg()
}


const removeImg = async () => {
   imgRef = ''
}



onMounted(() => {


   LogicClass = new QuizMetadataLogic(editImgBtn.value, hiddenFileInput.value, titleInput.value, descriptionInput.value, tagsInput.value, showCorrectionInput.value, store)

   LogicClass.fillFields(store.$state.quizMetadata)
   imgRef = store.$state.quizMetadata.image


   store.$subscribe(() => {
      LogicClass.fillFields(store.$state.quizMetadata)
      imgRef = store.$state.quizMetadata.image
   })
})
</script>

<style lang="scss">
@use '../../scss/mixins/input.scss' as *;

[data-c-quiz-meta-form] {
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


   [data-select-bar] {
      --select-width: 200px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      grid-template-columns: repeat(auto-fit, minmax(min(var(--select-width)), 100%), 1fr);
      gap: var(--g-list, 1rem);

      select {
         width: min(var(--select-width), 100%);
         grid-column: auto;
      }
   }

   label {
      @include card;
      @include input;
      --pbl: 0.7rem;
      --pin: 0.7rem;
      --border-color: #00000040;
      display: flex;
      align-items: center;
      justify-items: start;
   }

   textarea {
      resize: vertical;
      min-height: 140px;
   }

   button-component {
      --pbl: 0.6rem;
      --pin: 1.8rem;
      justify-self: right;
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
         --bg: #fff;
         --bg-h: #fff;
         --br: 0.4vmax;
         --border-w: 0;
         --border-w-h: 0;
         --size: 13px;
         --f-sans: 'Urbanist';
         cursor: pointer;
         letter-spacing: 0.5px;
         box-shadow: 0px 0 1px 1px rgb(0 0 0 / 0.03);

         &:hover {
            box-shadow: 0px 0 1px 1px rgb(0 0 0 / 0.07);
         }
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