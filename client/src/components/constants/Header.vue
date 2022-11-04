<template>
   <header data-c-header class="pbl-4 f-long even-cols">
      <div class="dis-flex j-between">

         <strong class="f-long">quizz</strong>

         <div class="dis-flex g-10">

            <nav class="dis-flex weight-mid f-long a-center g-4">
               <a href="#">home</a>
               <a href="#" style="--c: #C678E0">quizzes</a>
               <a href="#" style="--c: #7E9D43">about</a>
               <a href="#" style="--c: #E76A43">you</a>
            </nav>


            <a href="#" class="cta weight-black pbl-3 size-s0 pin-6">get started</a>
         </div>





      </div>
   </header>
</template>

<script setup lang="ts">
import logo from "@/assets/questions.svg"
</script>

<style lang="scss">
header[data-c-header] {
   width: 100%;
   display: flex;
   height: fit-content;

   --col-start: 2;
   --col-width: 6;

   >div {
      align-items: end;

      >* {
         height: fit-content;
      }

      >div {
         // background: #000;
         align-items: center;
      }

   }

   strong {
      font-size: clamp(1.7rem, 1.7rem + 4vw, 3.5rem);
      display: flex;
      place-items: center;
      line-height: 1.0;
   }



   nav {
      height: fit-content;
      padding-top: var(--size-2);

      a {
         color: var(--c, var(--clr-dlue));
         font-size: var(--f-size-s0);
         font-weight: var(--weight-mid);
         text-decoration: none;
         position: relative;
         line-height: .8;

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
   }

   a {
      font-size: var(--f-size-s0);
      text-decoration: none;
   }

   .cta {
      color: var(--clr-light);
      border-radius: 0;
      background: var(--clr-dlue);
      transition: 0.2s ease;

      &:hover {
         border-radius: 0.2vmax;
         background: var(--clr-blue);
      }

   }



   .img_box {
      width: 35px;
      height: 35px;
      aspect-ratio: 1 / 1;
      background: rgb(213, 214, 214);
      border-radius: 0.5vmax;
   }
}
</style>