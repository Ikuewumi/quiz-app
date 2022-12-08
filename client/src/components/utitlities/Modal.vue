<template>
   <Teleport to="#modals">
      <div data-c-modal v-if="props.showModal">
         <header class="sgrid even-cols">
            <div class="content">

               <strong>{{ props.header }}</strong>
               <svg viewBox="0 0 26 26" @click="emit('closeModal')">
                  <use href="#delete_metro"></use>
               </svg>
            </div>
         </header>


         <main class="sgrid even-cols" data-modal-main>
            <slot>

               <div class="content">
                  <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo, ipsa quaerat. Illo, eaque.
                     Quasiest quisquam inventore corporis ullam. Itaque.</p>
               </div>

            </slot>
         </main>
      </div>
   </Teleport>
</template>

<script setup lang="ts">
import { Teleport } from 'vue';
const props = defineProps({
   showModal: {
      default: false,
      type: Boolean
   },
   header: {
      default: "Modal Text",
      type: String
   }
})


const emit = defineEmits<{
   (event: 'closeModal'): void
}>()
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;



[data-c-modal] {

   --col-start: 2;
   --col-width: 6;

   z-index: 5;
   position: fixed;
   width: 100vw;
   height: 100vh;
   inset: 0 auto auto 0;
   background: var(--p-bg, #fff);
   overflow-y: auto;
   overflow-x: hidden;



   header {
      box-shadow: 0 1px 2px rgb(0 0 20 / 0.05);
      padding-block: 1rem;
      position: sticky;
      background: var(--bg-header, #fff);
      top: 0;

      strong {
         font-family: var(--f-header, 'Urbanist');
         font-size: var(--size-header, clamp(1.3rem, 1.3rem + 0.2vw, 1.5rem));
         font-weight: var(--weight-header, 700);
         color: var(--clr-header, #777);
      }

      svg {
         @include mSvg;
         cursor: pointer;
         --f: #777;
         --f-h: #333;
         --w: 30px;
      }

      .content {
         display: grid;
         grid-auto-flow: column;
         align-items: center;
         justify-content: space-between;
      }

      >* {
         grid-column: 2 / -2;
      }





   }


   [data-modal-main] {

      padding-block: var(--p-pbl, 1.2rem);

      p {
         line-height: var(--p-lh, 1.3);
      }


      >* {
         grid-column: 2 / -2;
      }


   }


}
</style>