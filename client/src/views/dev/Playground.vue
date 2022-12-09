<template>
   <div data-p class="sgrid even-cols p-center" data-c-playground>


   </div>
</template>

<script setup lang="ts">
const a = (...args: any[]) => console.log(args)

const showDialog = $ref(true)
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

[data-f-quiz-questions-bar] {}
</style>