<template>
   <header data-c-header class="pbl-4 f-long even-cols sgrid">
      <div class="dis-flex j-between">

         <RouterLink to="/"><strong class="f-long">quiz</strong></RouterLink>

         <div class="dis-flex g-10">

            <nav class="dis-flex weight-mid f-long a-center g-4">
               <RouterLink to="/">home</RouterLink>
               <RouterLink to="/quiz" style="--c: #C678E0">quizzes</RouterLink>
               <RouterLink to="/dev" style="--c: #7E9D43">about</RouterLink>
               <RouterLink to="/quiz" style="--c: #E76A43">you</RouterLink>
            </nav>


            <RouterLink v-if="!user.email" to="/auth" class="cta weight-black pbl-3 size-s0 pin-6">get started
            </RouterLink>
            <RouterLink to="/user" v-else>
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
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-header] {

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
   padding-bottom: 2rem;

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
      color: #000;
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