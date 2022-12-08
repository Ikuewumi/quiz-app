<template>
   <Teleport to="#modals">
      <div data-c-loader v-if="loader.msg > ''">
         <svg viewBox="0 0 605.46608 508.2661">
            <use href="#loader_question_svg"></use>
         </svg>
         <span class="loader"></span>

         <p class="mt-2">{{ loader.msg }}</p>
      </div>
   </Teleport>
</template>

<script setup lang="ts">
import { Teleport } from "vue"
import { useLoader } from "../../pinia/loader";


const loader = useLoader()
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-loader] {
   // --w-loader: min(500px, 60vw);
   --anim-time: 1.3s;


   z-index: 10;
   width: 100vw;
   height: 100vh;
   position: fixed;
   inset: 0 auto auto 0;
   display: grid;
   place-content: center;
   place-items: center;
   background: var(--bg, rgb(255 255 255 / 0.97));
   // gap: var(--g, 0.4rem);

   img,
   svg,
   figure {
      width: var(--w-img, min(200px, 40vw));
      // filter: opacity(0.3);

      animation: loader-opacity var(--anim-time) ease-out infinite alternate;

   }

   span.loader {
      width: var(--w-loader, min(350px, 80vw));
      height: var(--h-loader, 7px);
      background: var(--bg-loader, rgba(128, 122, 122, 0.09));
      border-radius: var(--br-loader, 2vmax);
      overflow-x: hidden;
      position: relative;


      &::before {
         content: '';
         position: absolute;
         top: 0;
         bottom: 0;
         height: 100%;
         left: 0;
         width: 30%;
         background: var(--clr-loader, #6c99ae40);
         border-radius: var(--br-loader, 2vmax);
         transform: translateX(0);


         animation: move-loader var(--anim-time) ease-out infinite alternate;
      }






      @keyframes move-loader {
         from {
            transform: translateX(-100%);
         }

         to {
            transform: translateX(var(--w-loader, min(350px, 80vw)));
         }
      }


      @keyframes loader-opacity {
         from {
            opacity: 0.3;
         }

         to {
            opacity: 1;
         }
      }




   }







}
</style>