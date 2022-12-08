<template>
   <form role="search" @submit.prevent="submitForm" data-c-search-bar>
      <input type="search" name="search" v-model="term" :placeholder="props.placeholder ?? 'Search questions...'">
      <button type="submit">
         <svg viewBox="0 0 26 26">
            <use href="#search_metro"></use>
         </svg>
      </button>
   </form>
</template>

<script setup lang="ts">
import { useToast } from '../../composables';

const props = defineProps(['placeholder'])
const emit = defineEmits<{
   (event: 'submitSearch', term: string): void
}>()
let term = $ref('')

const submitForm = () => {
   try {
      const isValid = term.trim() > ''
      if (!isValid) throw Error('please put in a search term')
      emit('submitSearch', term.trim())
   } catch (e) {
      const toast = useToast()
      toast.el.show(e as string, true)
   }
}
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-search-bar] {
   --w-svg: 35px;
   --br: 0;
   --br-h: 0;
   --border-w: 0.2px;
   --border-color-h: rgb(0 0 0 / 0.1);
   display: grid;
   grid-template-columns: 1fr var(--w-svg);
   width: var(--w-search, min(300px, 90%));
   --custom-br: 0.3vmax;
   --border-color: rgb(0 0 0 / 0.1);
   --br-h: 0;


   input {
      @include card;
      @include input;
      --pbl: 0;
      --h: 100%;
      --pin: 0.7rem;
      --border-w: 0.2px;
      --bg: #fff;
      --bg-h: #fff;


      &,
      &:hover {
         border-top-left-radius: var(--custom-br);
         border-bottom-left-radius: var(--custom-br);
      }
   }


   button {
      aspect-ratio: 1 / 1;
      cursor: pointer;
      @include card;
      @include mSvg;
      --border-w: 0;
      --border-w-h: 0;
      --pbl: 5px;
      --pin: 5px;
      --w: var(--w-svg);
      --bg-h: #60ace9;
      --bg: #4c8bbf;
      --f: #fff;
      --f-h: #fff;

      &,
      &:hover {
         border-top-right-radius: var(--custom-br);
         border-bottom-right-radius: var(--custom-br);
      }

      svg {}
   }

}
</style>