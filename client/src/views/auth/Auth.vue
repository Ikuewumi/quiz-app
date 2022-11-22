<template>
   <div data-c-auth data-p class="even-cols">

      <form v-if="isLoggingIn">
         <img :src="logo" alt="logo">

         <h1 class="f-slab size-s2">Login</h1>

         <div class="field">
            <img :src="gmail" alt="email">
            <input type="email" placeholder="Enter your email adress">
         </div>

         <div class="field">
            <img :src="lock" alt="lock">
            <input type="password" placeholder="Enter your password">
         </div>

         <input class="pbl-4 pin-2 text-center cursor" type="submit" value="Log In">

         <p class="mt-4 cursor">Don't have an account yet?, <span @click="toggleState" class="c-dlue">Sign Up</span>
         </p>
      </form>

      <form v-else>
         <img :src="logo" alt="logo">

         <h1 class="f-slab size-s2">Sign Up</h1>

         <div class="field">
            <img :src="user" alt="user">
            <input type="name" placeholder="Your name please...">
         </div>
         <div class="field">
            <img :src="gmail" alt="email">
            <input type="email" placeholder="Enter your email adress">
         </div>

         <div class="field">
            <img :src="lock" alt="lock">
            <input type="password" placeholder="Enter your password">
         </div>

         <input class="pbl-4 pin-2 text-center cursor" type="submit" value="Sign Up">

         <p class="mt-4 cursor">Already have an account?, <span @click="toggleState" class="c-dlue">Log In</span>
         </p>
      </form>


   </div>
</template>

<script setup lang="ts">
import lock from "@/assets/lock.svg"
import user from "@/assets/user.svg"
import logo from "@/assets/questions.svg"
import gmail from "@/assets/gmail.svg"

let isLoggingIn = $ref(true);
const toggleState = () => isLoggingIn = !isLoggingIn
</script>

<style lang="scss">
@use "@/scss/abstracts/mq" as *;

[data-c-auth] {
   width: 100%;
   height: 100%;
   --col-start: 2;
   --col-width: 6;

   p {
      font-size: 0.9rem;
   }

   form>img {
      width: min(50vw, 150px);
      place-self: center;
      // margin-top: -50%;
   }


   form {
      font-family: var(--f-poppins);
      font-size: var(--f-size-s1);
      // width: min(400px, 90vw);
      display: grid;
      grid-template-columns: 0.6rem auto 0.6rem;
      padding-block: 2rem;
      padding-block-end: 2.5rem;
      background: #fff;
      gap: 0.8rem;
      border-radius: 0.5vmax;
      line-height: 1;
      box-shadow: 0 0 2px rgb(0 0 0 / 0.2);
      max-width: 90vw;



   }

   form>* {
      grid-column: 2/-2;
   }

   .field {
      display: flex;
      align-items: center;
      // gap: 0.1rem;
      padding-inline-start: 0.5rem;
      padding-block: 0.4rem;
   }

   .field>img {
      width: 20px;
   }

   .field {
      border: 0.5px solid rgba(0, 0, 0, 0.06);
      border-radius: 0.4vmax;
      gap: 0.5rem;

      &+& {
         margin-top: 0.5rem;
      }
   }

   .field>input {
      width: 100%;
      padding: 0.3rem 0rem;
      outline: none;
      border: none;
   }

   input {
      min-width: 0;
      font-family: var(--f-poppins);

      font-size: var(--f-size-tiny);

      @include mq(small) {
         font-size: var(--f-size-tiny);
      }


   }

   h1 {
      font-family: var(--f-slab);
   }

   input[type=submit] {
      background: var(--clr-dlue);
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.02);
      outline: none;
      border: none;
      border-radius: 0.3vmax;
      color: #fff;
      transition: 0.2s ease;
   }

   input[type=submit]:hover {
      background: #86c9e7;
   }
}
</style>