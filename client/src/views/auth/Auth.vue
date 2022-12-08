<template>
   <div data-c-auth data-p>

      <form v-if="isLoggingIn" ref="logInForm" @submit.prevent="logUserIn">
         <RouterLink to="/">
            <svg viewBox="0 0 844.67538 595.26155">
               <use href="#question_svg"></use>
            </svg>
         </RouterLink>
         <h1 class="f-slab size-s2">Login</h1>
         <div class="field">
            <img :src="gmail" alt="email">
            <input type="email" name="email" placeholder="Enter your email adress">
         </div>
         <div class="field">
            <img :src="lock" alt="lock">
            <input type="password" name="password" placeholder="Enter your password">
         </div>
         <input class="pbl-4 pin-2 text-center cursor" type="submit" value="Log In">
         <p class="mt-4 cursor">Don't have an account yet?, <span @click="toggleState" class="c-dlue">Sign Up</span>
         </p>
      </form>

      <form v-else ref="signUpForm" @submit.prevent="signUserUp">
         <RouterLink to="/">
            <svg viewBox="0 0 844.67538 595.26155">
               <use href="#question_svg"></use>
            </svg>
         </RouterLink>
         <h1 class="f-slab size-s2">Sign Up</h1>
         <div class="field">
            <img :src="user" alt="user">
            <input name="name" type="name" placeholder="Your name please...">
         </div>
         <div class="field">
            <img :src="gmail" alt="email">
            <input name="email" type="email" placeholder="Enter your email adress">
         </div>
         <div class="field">
            <img :src="lock" alt="lock">
            <input name="password" type="password" placeholder="Enter your password">
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
import gmail from "@/assets/gmail.svg"

import { regexObject, setAccessExpiryDate, setRefreshToken, setToken, validateRegex } from "../../composables/env"
import { createToastPromise, useToast } from "../../composables"
import { apiGet, apiPost } from "../../composables/auth"
import { AuthTypes, MessageTypes } from "types"
import { ref } from "vue"
import { useUser } from "../../pinia/user"
import { useRouter } from "vue-router"

let isLoggingIn = $ref(true);
const toggleState = () => isLoggingIn = !isLoggingIn

const signUpForm = ref(null as unknown as HTMLFormElement)
const logInForm = ref(null as unknown as HTMLFormElement)

const a = (...args: any[]) => console.log(args)

const user_ = useUser()
const router = useRouter()




const signUserUp = () => {
   createToastPromise(async () => {

      const f = new FormData(signUpForm.value! as HTMLFormElement)
      const [name, email, password] = [
         f.get('name') as unknown as string,
         f.get('email') as unknown as string,
         f.get('password') as unknown as string,
      ]

      const nameValue = await validateRegex('name', name, 'invalid name! does not have the match pattern')
      const emailValue = await validateRegex('email', email, 'email is invalid! it does not match pattern')
      const passwordValue = await validateRegex('password', password, 'password must be more than 6 charaters, at least')

      console.log(emailValue, passwordValue)

      const result = await apiPost('auth/signup', {
         name: nameValue,
         email: emailValue,
         password: passwordValue
      }, false) as MessageTypes.Msg


      console.log('results', result)
      useToast().el.show(result.message, false)


   }, 'Signing user up..')()
}

const logUserIn = () => {
   createToastPromise(async () => {
      const f = new FormData(logInForm.value! as HTMLFormElement)
      const [email, password] = [
         f.get('email') as unknown as string,
         f.get('password') as unknown as string,
      ]

      const emailValue = await validateRegex('email', email, 'email is invalid! it does not match pattern')
      const passwordValue = await validateRegex('password', password, 'password must be more than 6 charaters, at least')

      const result = await apiPost('auth/login', {
         email: emailValue,
         password: passwordValue
      }, false) as AuthTypes.Tokens


      setToken(result.accessToken)
      setRefreshToken(result.refreshToken)
      setAccessExpiryDate()

      useToast().el.show(`${emailValue} has been signed in`, false)
      await user_.getUserData()
      router.push('/user')

   }, 'Logging user in...')()
}



</script>

<style lang="scss">
@use "@/scss/abstracts/mq" as *;

[data-c-auth] {
   width: 100vw;
   height: 100vh;

   display: grid;
   place-items: center;

   p {
      font-size: 0.9rem;
      text-align: center;
      line-height: 1.5;
   }

   form>a>img,
   form>a>svg {
      width: min(50vw, 150px);
      place-self: center;
      // margin-top: -90%;
      position: absolute;
      inset: 0 auto auto 50%;
      transform: translate(-50%, -100%);
   }


   form {
      position: relative;
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
      // max-width: 90vw;
      width: min(350px, 90vw);
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
      // margin-bottom: var(--size-2);
      text-align: center;
      visibility: hidden;
      display: none;
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