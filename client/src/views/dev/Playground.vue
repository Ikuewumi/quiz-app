<template>
   <div data-p class="sgrid even-cols p-center" data-c-playground>
      <ErrorComponent msg="Oops! This page does not exist" link="/" link-msg="To Home" :show-link="true" />
   </div>
</template>

<script setup lang="ts">
import ErrorComponent from "../../components/utitlities/ErrorComponent.vue"
import { title } from "../../composables"


title('Error Page')
</script>

<style lang="scss">
[data-c-playground] {
   --col-start: 2;
   --col-width: 6;

   row-gap: var(--size-6);


   &>* {
      grid-column: 2/ -2
   }
}
</style>