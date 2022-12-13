<template>
   <div data-c-pagination-bar>
      <button @click="emit('showMore')" v-if="props.showMore">See More</button>

      <small>{{ props.text }}</small>
   </div>
</template>

<script setup lang="ts">
const props = defineProps({

   text: { default: "All items listed" },
   showMore: { default: true }

})


const emit = defineEmits<{
   (event: 'showMore'): void
}>()
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-pagination-bar] {
   width: 100%;
   display: grid;
   place-items: center;
   row-gap: var(--size-7);

   button {
      @include buttons;
      --border-w: 0.2px;
      --border-w-h: 0.2px;
      --pbl: 0.7rem;
      --bg: #555;
      --clr: #fff;
      --bg-h: #333;
      --clr-h: #fff;

      // width: fit-content;
   }

   small {
      font-size: var(--small-size, clamp(12px, 10px + 1vw, 1ch));
   }
}
</style>