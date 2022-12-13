<template>
   <div data-c-quiz-metadata>
      <div class="img">
         <img :src="props.data.image" alt="quiz_img">
      </div>
      <main>
         <strong role="heading">{{ props.data.title }}</strong>
         <cite>By <RouterLink :to="`/user/${props.data.aid}`">{{ props.author.name }}</RouterLink></cite>

         <p>
            {{ props.data.description }}
         </p>

         <figure>
            <span data-tag class="mt-1">
               <svg viewBox="0 0 26 26">
                  <use href="#hashtag_metro"></use>
               </svg>
               <span>
                  {{ props.data.tags[0] }}
               </span>
            </span>
         </figure>


         <span class="btn-bar" v-if="props.data.drafted || props.data.aid === user._id">
            <button @click="emit('editQuiz')" style="--bg-h: var(--clr-blue)">
               <svg viewBox="0 0 26 26">
                  <use href="#edit_metro"></use>
               </svg>

               <!-- <span>Edit</span> -->
            </button>



            <button @click="emit('deleteQuiz')" style="--bg-h: var(--clr-pink)"
               v-if="props.data.drafted && props.data.aid === user._id">
               <svg viewBox="0 0 26 26">
                  <use href="#delete_metro"></use>
               </svg>

               <!-- <span>Delete Quiz</span> -->
            </button>


         </span>

         <section>
            <button v-if="!props.data?.drafted" @click="emit('takeQuiz')">
               <svg viewBox="0 0 26 26">
                  <use href="#play_metro"></use>
               </svg>

               <span>Take Quiz</span>
            </button>

            <button v-else @click="emit('publishQuiz')">
               <svg viewBox="0 0 26 26">
                  <use href="#enter_metro"></use>
               </svg>

               <span>Publish Quiz</span>
            </button>
         </section>
      </main>
   </div>
</template>

<script setup lang="ts">
import { DocumentTypes, QuizTypes, UserTypes } from "types";
import mockImg from "../../assets/transistor-404.png";
import { RouterLink } from "vue-router"
import { useUser } from "../../pinia/user";


const emit = defineEmits<{
   (event: 'takeQuiz'): void,
   (event: 'publishQuiz'): void,
   (event: 'deleteQuiz'): void,
   (event: 'editQuiz'): void,

}>()

const props = defineProps({
   data: {

      default: {
         title: "A title",
         description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus possimus facere vitae exercitationem, dolorem earum. Perferendis maiores ipsum ea?",
         bookmarks: 0,
         drafted: true,
         tags: ["array", "art"],
         image: mockImg,
         showCorrection: true,
         _id: ""

      } as DocumentTypes.Quiz

   },


   author: {
      default: {
         name: "Artie Stome",
         _id: "" as string | undefined
      }
   }
})


const user = useUser()
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;



[data-c-quiz-metadata] {

   --img-width: 250px;

   gap: var(--size-5);
   display: grid;
   position: relative;
   width: var(--p-w, 100%);

   figure {
      display: grid;
      align-items: normal;
      justify-items: start;
      justify-content: start;
      gap: var(--size-3);
      grid-auto-flow: column;
      // grid-auto-column: 1fr;
   }

   [data-tag] {
      @include card;
      display: grid;
      grid-auto-flow: column;
      width: fit-content;
      place-items: center;
      cursor: pointer;
      gap: var(--size-1);

      --bg: #fff;
      --bg-h: #fff;
      --br: 0.4vmax;
      --border-w: 0;
      --border-w-h: 0;
      --size: 12px;
      --f-sans: 'Urbanist';
      cursor: pointer;
      letter-spacing: 0.5px;
      box-shadow: 0px 0 1px 1px rgb(0 0 0 / 0.08);

      &:hover {
         box-shadow: 0px 0 1px 1px rgb(0 0 0 / 0.1);
      }

      svg {
         @include mSvg;
         --w: 10px;
         --f: #555;
      }
   }



   [data-f-tag] {
      font-family: var(--f-content, 'Work Sans');
      font-weight: var(--weight-content, 400);
      font-size: var(--size-content, 1rem);
      display: grid;
      grid-auto-flow: column;
      // width: max-content;
      place-items: center;
      cursor: pointer;
      gap: var(--size-1);

      svg {
         @include mSvg;
         --w: 10px;
         --f: #555;
      }
   }




   .img {
      width: min(var(--img-width), 50vw);
      aspect-ratio: 1 / 1;
      background: rgb(255, 255, 255);
      outline: 1px solid rgb(0 0 0 / 0.05);
      outline-offset: -2px;
      border-radius: 0.5vmax;
      position: relative;
      overflow: hidden;

      img {
         object-fit: cover;
         width: 100%;
         height: 100%;
      }
   }


   span.btn-bar {
      --offset: 0px;

      position: absolute;
      inset: var(--offset) var(--offset) auto auto;
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
         --border-w-h: 0.2px;
         --border-w: 0.2px;
         --border-color: rgb(0 0 0 / 0.11);
         --border-color-h: rgb(0 0 0 / 0.021);
         // --bg-h: rgb(255 255 255 / 0.5);
         --fill: #777;

         &:hover svg {
            fill: #fff;
         }
      }

   }


   section {
      display: flex;
      width: fit-content;
      flex-wrap: wrap;
      place-items: center;
      cursor: pointer;
      gap: var(--size-3);
      margin-top: var(--size-3);

      button svg {
         @include mSvg;
         --w: 25px;
         --f: rgb(0 0 0 / 0.2);
         --f-h: rgb(0 0 0 / 0.2);
         --bg: transparent;
         --bg-h: transparent;
      }

      button {
         @include buttons;
         flex-basis: fit-content;
         display: flex;
         place-items: center;
         gap: var(--size-2);
         --size: clamp(13px, 13px + 3vw, 15px);
         letter-spacing: 1px;
         --pin: 0.8rem;
         --pbl: 0.47rem;
         --bg: rgba(61, 126, 146, 0.6);
         --clr: #fff;
         --border-w: 0;

         box-shadow: 0 0 2px 1px rgb(0 0 0 / 0.2);

         &:hover {
            background: rgba(76, 160, 185, 0.6);

            svg {
               fill: #fff;
            }
         }
      }


   }

   main {

      display: grid;
      gap: var(--size-4);
      position: static;
      height: fit-content;
      padding: var(--main-padding, 0.2rem 0);

      * {
         line-height: 1.2;
      }


   }

   strong {

      font-size: var(--size-strong, clamp(1.6rem, 1.6rem + 2vw, 1.8rem));
      font-family: var(--f-strong, 'Urbanist');
      font-weight: var(--weight-strong, 400);

   }

   cite {

      font-size: var(--size-cite, clamp(0.8rem, 0.8rem + 2vw, 0.9rem));
      font-family: var(--f-cite, 'Urbanist');
      font-weight: var(--weight-cite, 900);
      color: var(--clr-cite, #999);

      a {
         color: var(--clr-cite, #999);
         text-decoration: none;


         &:hover {
            color: var(--clr-cite, #555);
         }
      }

   }



   @media (max-width: 800px) {}


   @media (min-width: 800px) {
      .img {
         grid-column: 1 / 2;
      }

      & {
         grid-template-columns: var(--img-width) 1fr;

         >* {
            grid-column: 2 / -1;
         }
      }
   }




}
</style>