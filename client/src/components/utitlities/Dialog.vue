<template>
   <div data-c-dialog @click.self="emit('no')" role="alertdialog" v-if="props.showDialog" class="sgrid even-cols">
      <section>
         <h3>{{ props.text }}</h3>
         <footer>
            <span tabindex="-1" @click="emit('no')">
               <svg style="--f:#f53c2f" viewBox="0 0 26 26">
                  <use href="#delete_metro"></use>
               </svg>
            </span>



            <span tabindex="-1" @click="emit('yes')">
               <svg style="--f:#4caf50" viewBox="0 0 26 26">
                  <use href="#checkmark_metro"></use>
               </svg>
            </span>


         </footer>
      </section>
   </div>
</template>

<script setup lang="ts">
const props = defineProps({
   text: {
      default: "Do something?"
   },

   showDialog: {
      default: true
   }
})

const emit = defineEmits<{
   (event: 'yes'): void,
   (event: 'no'): void,
}>() 
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-dialog] {

   --col-start: 2;
   --col-width: 6;



   width: 100vw;
   height: 100vh;
   z-index: 9;

   position: fixed;
   inset: auto 0 0 auto;
   display: grid;
   background: rgba(74, 74, 80, 0.275);


   padding-top: var(--p-top, 1.5rem);


   section {
      border-radius: var(--br-dialog, 0.3vmax);
      box-shadow: 0 0 2px rgb(0 0 0 / 0.05);
      overflow: hidden;
      width: var(--w-dialog, 100%);
      display: grid;
      grid-template-columns: minmax(0.3rem, 1fr) 90% minmax(0.3rem, 1fr);
      place-content: normal center;
      height: fit-content;
      background: #fff;

      >* {
         grid-column: 1 / -1;
      }

      >h3 {
         grid-column: 2 / -2;
      }
   }

   h3 {
      padding: var(--padding-dialog, 1.7rem 0);
      font-size: var(--size-dialog, clamp(1.3rem, 1.3rem + 2vw, 1.5rem));
      font-family: var(--f-dialog, 'Urbanist');
      font-weight: var(--weight-dialog, 400);
   }

   footer {

      display: grid;
      grid-auto-flow: column;

      span {
         width: 100%;
         display: grid;
         place-items: center;
         padding: var(--padding-svg, 0.9rem 0);
         cursor: pointer;
         outline: 0.1px solid rgb(0 0 0/ 0.02);
         transition: 0.2s ease;

         &:hover,
         &:focus-within {
            background: rgb(0 0 0 / 0.03);
         }
      }


      svg {
         @include mSvg;
         --w: 30px;
         --f-h: var(--f);
      }



   }




}
</style>