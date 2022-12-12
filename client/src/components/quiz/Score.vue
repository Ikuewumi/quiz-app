<template>
   <div data-c-score ref="scoreEl">
      <svg viewBox="-10 -10 160 160">
         <circle data-transparent cx="70" cy="70" r="70"></circle>
         <circle data-loader cx="70" cy="70" r="70"></circle>
      </svg>

      <strong>{{ props.percent }}%</strong>
   </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { sleep } from "../../composables"

const scoreEl = $ref(null as unknown as HTMLDivElement)
const loaderVar = '--percent'

const props = defineProps({
   percent: {
      type: Number,
      default: 0
   }
})

const setPercent = async () => {
   scoreEl.style.setProperty(loaderVar, String(props['percent']))
}


onMounted(async () => {
   await sleep(500)
   setPercent()
   watch(props, setPercent)
})


</script>

<style lang="scss">
[data-c-score] {
   width: var(--svg-w);
   height: var(--svg-w);
   aspect-ratio: 1 / 1;
   display: grid;

   >* {
      grid-column: 1 / -1;
      grid-row: 1 / -1;
      place-items: center;
   }

   strong {
      width: fit-content;
      height: fit-content;
      place-self: center;
      font-family: var(--f-score, 'Urbanist');
      font-size: var(--size-score, clamp(1.2rem, 1.2rem + 1ch, 2rem));
   }

   svg {
      transform: rotate(-90deg);
      width: var(--svg-w);

      circle {
         fill: transparent;

      }

      circle[data-transparent] {
         stroke: rgb(0 0 0 / 0.02);
         stroke-width: 10px;
         box-shadow: 0 0 2px 1px rgb(00 0 0 / 0.2);
      }



      circle[data-loader] {
         stroke: var(--clr-score);
         stroke-width: 10px;
         stroke-linecap: round;

         //440px is the full length offset and array
         stroke-dasharray: var(--full-offset);
         stroke-dashoffset: calc(var(--full-offset) - (var(--full-offset) * var(--percent)) / 100);


         transition: stroke-dashoffset 1.5s ease;
      }
   }
}
</style>