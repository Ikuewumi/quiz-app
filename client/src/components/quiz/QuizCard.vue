<template>
   <div data-c-quiz-card>
      <img :src="props.data.image" alt="">

      <div class="content">

         <RouterLink :to="link">
            <h3>{{ props.data.title }}</h3>
         </RouterLink>
         <span data-tag class="mt-1">
            <svg viewBox="0 0 26 26">
               <use href="#hashtag_metro"></use>
            </svg>
            <span>
               {{ props.data.tags[0] }}
            </span>
         </span>

      </div>
   </div>
</template>

<script setup lang="ts">
import logo from "../../assets/questions.svg";
import { DocumentTypes, QuizTypes } from "types"
import { RouterLink } from "vue-router"


const props = defineProps({

   data: {
      default: {
         image: logo,
         title: "A Dummy Title",
         tags: ["the", "street"],
         description: "scghdbjvn k nodhvkjo nbsigdfmij nbsjkgl;ahjg;j ngiembg nbhergn beogn merhkjgbo anehrpgby enrhgu aiwom-fy",
         showCorrection: false,
         bookmarks: 0,
         drafted: false,
         aid: "",
      } as DocumentTypes.Quiz
   }


})





const link = $computed(() => {

   /**@ts-ignore */
   const id = props.data._id! as string
   const isValid = props.data.drafted ? `/admin/drafts/${id!}` : `/quiz/${id}`
   return isValid


})

</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

div[data-c-quiz-card] {


   --c-br: 0.5vmax;
   --card-image-width: 100px;

   border-radius: var(--c-br);
   width: 100%;
   background: var(--p-bg, #fff);
   padding-inline: var(--p-pin, 0);
   padding-block: var(--p-pbl, 0);
   outline: 1px solid rgb(0 0 0 / 0.02);
   display: grid;
   box-shadow: var(--p-shadow, 0 0 2px rgb(0 0 0 / 0.02));
   grid-template-columns: var(--card-image-width) auto;
   gap: var(--p-gap, 0);
   position: relative;
   overflow: hidden;






   .content {
      align-self: center;
      display: grid;
      gap: var(--g-content, 0.24rem);
      padding: var(--p-card-content, 1.4rem 0.5rem);
      align-items: normal;
      justify-items: start;
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
      --pin: var(--size-3);
      --pbl: 0.1rem;
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



   img {
      background: rgb(0 0 0 / 0.01);
      border-top-left-radius: var(--c-br);
      border-bottom-left-radius: var(--c-br);
      object-fit: cover;
      width: var(--card-image-width);
      height: var(--card-image-height, 100%);
   }


   @media (max-width: 450px) {
      --card-image-width: 80px;
      --card-image-height: 100%;
   }


}


[data-f-quiz-card-list] {

   width: 100%;
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
   gap: var(--g-list, 1rem);


}
</style>