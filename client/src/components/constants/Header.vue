<template>
   <header data-c-header class="pbl-4 f-long even-cols sgrid" :class="navClass">
      <div class="dis-flex j-between">

         <article class="dis-flex p-center g-2">
            <svg viewBox="0 0 26 26" @click="(navOpen = true)" class="cursor">
               <use href="#menu_metro"></use>
            </svg>


            <RouterLink to="/" class="mb-1">
               <strong>quiz</strong>
            </RouterLink>


         </article>

         <div class="dis-flex g-10" data-super-nav>

            <nav class="dis-flex weight-mid a-center g-4" @click="(navOpen = false)">
               <RouterLink to="/">home</RouterLink>
               <RouterLink to="/quizzes" style="--c: #C678E0">quizzes</RouterLink>
            </nav>


            <RouterLink v-if="!user.email" to="/auth" class="cta f-long weight-black pbl-3 size-s0 pin-6">get started
            </RouterLink>
            <RouterLink to="/you" v-else>
               <figure data-auth-pic class="img">
                  <img v-if="user.image" :src="user.image" alt="User Profile Picture">
               </figure>
            </RouterLink>
         </div>





      </div>
   </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router"
import { useUser } from "../../pinia/user";
const user = useUser()
const navOpen = $ref(false)
const navClass = $computed(() => navOpen ? 'open' : '')
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-header] {

   [data-super-nav] {
      // margin-top: var(--size-3);
      height: 100%;
      align-self: strech;
      align-content: center;
      align-items: center;
   }

   figure {}

   svg {
      --svg-w: 20px;
      width: var(--svg-w);
      display: none;

      @media (max-width: 700px) {
         display: block;
      }
   }

   svg.svg-header {
      --svg-w: 40px;
   }

   .img {
      --img-width: 35px;
      cursor: pointer;
      width: min(var(--img-width));
      aspect-ratio: 1 / 1;
      background: rgb(255, 255, 255);
      outline: 1px solid rgb(0 0 0 / 0.2);
      box-shadow: 0 0 2px 2px rgb(0 0 0 / 0.02);
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

   width: 100%;
   height: fit-content;
   padding-block: 2rem;
   background: #fff;
   margin-bottom: var(--size-5);

   @media (max-width: 700px) {
      padding-block: 1.2rem;
   }

   --col-start: 2;
   --col-width: 6;

   box-shadow: 0 0.5px 1px 1px rgb(0 0 0 / 0.02);

   >div {
      align-items: end;

      >div {
         // background: #000;
         align-items: center;
      }

   }

   strong {
      font-size: clamp(1.7rem, 1.7rem + 4vw, 5ch);
      font-family: 'Abril Fatface';
      font-family: 'Urbanist';
      // display: none;
      place-items: center;
      line-height: 0.7;
      color: #777;
   }

   &.open {
      nav {
         @media (max-width: 700px) {
            display: grid;
         }
      }
   }



   nav {
      height: fit-content;

      a {
         color: var(--c, var(--clr-dlue));
         font-size: var(--size-header-link);
         font-weight: var(--weight-mid);
         font-family: 'Urbanist';
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

      @media (max-width: 700px) {

         position: fixed;
         width: 100vw;
         height: 100vh;
         z-index: 10;
         width: 100vw;
         height: 100vh;
         position: fixed;
         inset: 0 auto auto 0;
         display: grid;
         place-content: center;
         place-items: center;
         background: var(--bg, rgb(255 255 255 / 0.97));
         gap: 1.5rem;
         display: none;

         --size-header-link: var(--f-size-s0);
         --size-header-link: clamp(1.3rem, 1.3rem + 2vw, 3ch);

         a {
            text-transform: uppercase;
         }


      }

      @media (min-width: 700px) {
         // padding-top: var(--size-2);
         // align-self: end;
         --size-header-link: clamp(1.2rem, 1.2rem + 2vw, 1.7ch);


      }
   }

   a {
      font-size: var(--size-header-link);
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