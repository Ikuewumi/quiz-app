<template>
   <div data-c-history-card>
      <div class="content">

         <RouterLink :to="link">
            <h3>{{ props.data.title }}</h3>
         </RouterLink>
         <span data-tag>
            <svg viewBox="0 0 26 26">
               <use href="#clock_metro"></use>
            </svg>
            <span>
               {{ date }}
            </span>
         </span>

      </div>

      <div class="score">
         <Score data-hc-score :percent="percent"></Score>
      </div>
   </div>
</template>

<script setup lang="ts">
import logo from "../../assets/questions.svg";
import { DocumentTypes, QuizTypes } from "types"
import { RouterLink } from "vue-router"
import Score from "./Score.vue";


const props = defineProps({

   data: {
      default: {
         title: "A Dummy Title",
         uid: "",
         data: { "score": 2, "total": 6 },
         aid: "",
         timestamp: 1670774064559,
         qid: "",
         _id: ""
      } as DocumentTypes.History
   },



})


const percent = $computed(() => {

   return Math.floor(100 * (props.data.data.score / props.data.data.total))



})


const formatter = new Intl.RelativeTimeFormat('en')
const date = $computed(() => {

   const dateDiff = Date.now() - props.data.timestamp
   const x = formatter.format(Math.floor(-dateDiff / (1000 * 60 * 60 * 24)), 'days')
   return x



})




const link = $computed(() => {

   /**@ts-ignore */
   const id = props.data.qid! as string
   const isValid = `/quiz/${id}`
   return isValid


})

</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;


[data-f-history-list] {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(min(350px, 100%), 1fr));
   width: 100%;
   gap: 1rem;
}

div[data-c-history-card] {


   --c-br: 0.5vmax;
   --card-image-width: 100px;

   border-radius: var(--c-br);
   width: min(100%);
   background: var(--p-bg, #fff);
   padding-inline: var(--p-pin, 0);
   padding-block: var(--p-pbl, 0);
   outline: 1px solid rgb(0 0 0 / 0.02);
   display: grid;
   box-shadow: var(--p-shadow, 0 0 2px rgb(0 0 0 / 0.02));
   // height: 100px;
   grid-template-columns: auto var(--card-image-width);
   gap: var(--p-gap, 0);
   position: relative;

   .score {
      // place-self: center;
      padding: 2px;
      width: 100px;
      height: 100%;
      display: grid;
      place-items: center;
   }

   [data-hc-score][data-c-score] {
      --svg-w: 80px;
      --percent: 0;
      --full-offset: 440px;
      --clr-score: rgb(37, 140, 209);
      --size-score: clamp(0.8rem, 0.8rem + 1vw, 1.8ch);
   }


   @media (max-width: 450px) {
      --card-image-width: 90px;
   }



   .content {
      align-self: center;
      display: grid;
      gap: var(--g-content, 0.24rem);
      padding: var(--p-card-content, 1.4rem 0.5rem);
      align-items: normal;
      justify-items: start;
      padding-left: 15px;
      padding-right: 0;


      @media (max-width: 450px) {
         padding: 0;
         padding-left: 5px;

      }
   }

   a {
      text-decoration: none;
      color: var(--link, #000);

      &:hover {
         text-decoration: underline;
         color: var(--link-h, rgb(29, 137, 209))
      }

   }

   h3 {
      font-family: var(--f-title, 'Urbanist');
      font-weight: var(--weight-title, 500);
      font-size: var(--size-title, clamp(1rem, 1rem + 0.2vmax, 1.15rem));
      color: #222;
   }

   [data-tag] {
      font-family: var(--f-content, 'Urbanist');
      font-weight: var(--weight-content, 400);
      font-size: var(--size-content, 0.8rem);
      display: grid;
      grid-auto-flow: column;
      width: fit-content;
      place-items: center;
      cursor: pointer;
      gap: var(--size-1);

      span {}

      svg {
         @include mSvg;
         --w: 10px;
         --f: #555;
      }
   }



   img {
      background: rgb(0 0 0 / 0.01);
      border-top-left-radius: var(--c-br);
      border-bottom-left-radius: var(--c-br);
      object-fit: cover;
      width: var(--card-image-width);
      height: var(--card-image-width);
   }


}


[data-f-quiz-card-list] {

   width: 100%;
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
   gap: var(--g-list, 1rem);


}
</style>