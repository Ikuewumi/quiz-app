<script setup lang="ts">
import { watchEffect } from 'vue';
import Header from './components/constants/Header.vue';
import useMode from './pinia/mode'
import { useRoute } from 'vue-router';
const mode = useMode()
const route = useRoute()

const fullScreenRoutes = [
   'auth', 'quiz'
]

watchEffect(() => {
   if (fullScreenRoutes.includes(route.name as string)) {
      mode.hideHeader()
   } else {
      mode.showHeader()
   }


})

</script>

<template>
   <Header v-if="false || mode.modeHeader" />

   <RouterView />
</template>

<style lang="scss">

</style>
