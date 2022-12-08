<template>
   <div data-c-err-comp>
      <img :src="props.img">
      <h1>{{ props.msg }}</h1>

      <RouterLink v-if="props.showLink" :to="props.link">{{ props.linkMsg }}</RouterLink>
   </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import errorImg from "../../assets/error.svg"



const props = defineProps({
   msg: { default: "Oops! Something went wrong!" },
   img: { default: errorImg },
   linkMsg: { default: 'Go Home' },
   link: { default: '/' },
   showLink: { default: false }
})
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;


[data-c-err-comp] {

   width: var(--p-w, 100%);
   display: grid;
   place-items: center;
   gap: 0rem;
   text-align: center;

   h1 {
      // margin-top: -0.1rem;
      font-family: var(--f-h1, 'Urbanist');
      color: var(--clr-h1, #555);
      font-weight: var(--weight-h1, 400);
      font-size: var(--size-h1, clamp(1rem, 1rem + 2vw, 1.3rem))
   }

   svg,
   img,
   figure {
      width: var(--w-img, min(250px, 60%));
      height: fit-content;
      fill: #888;
      // fill: #888;
      // @include mSvg;
      height: fit-content;
   }

   p,
   a {
      margin-top: var(--size-7);
   }


   a {
      @include buttons;
      --pbl: 0.8rem;
      --pin: 1.5rem;
      --border-w: 1px;
      --border-color: rgb(0 0 0 / 0.2);
   }

}
</style>