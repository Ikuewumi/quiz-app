<template>
   <span role="button" data-c-tag ref="tag">
      {{ props.content }}
   </span>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps({
   content: {
      type: String,
      default: 'contentful shit'
   }
})

const randomColors = [
   '#ef5350',
   '#ff5790',
   '#c35bd5',
   '#60ace9',
   '#009688',
   '#67b46a',
   '#f49509',
   '#6c99ae'
]



const clr = $computed(() => randomColors.sort(_ => Math.random() - 0.5)[0])
const tag = $ref(null as unknown as HTMLSpanElement)
const bgVar = '--bg'
const bgVarH = '--bg-h'
const clrVar = '--clr'
const clrVarH = '--clr-h'


const changeColors = () => {
   tag.style.setProperty(bgVar, clr)
   tag.style.setProperty(bgVarH, clr)
   tag.style.setProperty(clrVar, '#fff')
   tag.style.setProperty(clrVarH, '#fff')
}


onMounted(changeColors)






</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-f-tag-list] {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: var(--g-tag-list, var(--size-3));
   flex-wrap: wrap;
   // grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
   width: var(--w-tag-list, 100%);
}

[data-c-tag] {
   @include buttons;
   --border-w: 0px;
   --border-w-h: 0px;
   --size: var(--size-tag, 13px);


   &:hover {
      box-shadow: 0 0 1px 2px rgb(0 0 0 / 0.1);
   }
}
</style>