<template>
   <div data-c-quiz-bar>
      <span class="bar" @click="emit('goToMeta', true)" tabindex="-1" :class="props.classIsMeta ? 'on' : ''">
         meta
      </span>
      <span class="bar" @click="emit('goToMeta', false)" tabindex="-1" :class="!props.classIsMeta ? 'on' : ''">
         questions
      </span>
   </div>
</template>

<script setup lang="ts">
const props = defineProps({
   classIsMeta: {
      default: true
   }
})

const emit = defineEmits<{
   (event: 'goToMeta', bool: boolean): void
}>()
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-quiz-bar] {
   width: var(--p-w, min(300px, 100%));
   display: grid;
   grid-auto-flow: column;
   grid-template-columns: repeat(2, 1fr);
   gap: var(--gap, 0.2rem);

   span.bar {
      @include card;
      cursor: pointer;
      text-align: center;
      box-shadow: 0 0 1px 1px rgb(0 0 0 / 0.03);
      --f-sans: 'Urbanist';
      --size: clamp(1rem, 1rem + 0.3vw, 1.2rem);
      --bg: var(--normal-bg, #fff);
      --bg-h: var(--normal-bg-h, #fff);
      --clr: var(--normal-bg, #555);
      --clr-h: var(--normal-bg, #555);
      --pbl: var(--size-3);

      --border-w: 0;
      --border-w-h: 0;

      &:hover {
         // box-shadow
      }


      &.on {
         --bg: var(--active-bg, #6c99ae);
         --bg-h: var(--active-bg-h, #6c99ae);
         --clr: var(--active-bg, #fff);
         --clr-h: var(--active-bg, #fff);
      }

   }
}
</style>