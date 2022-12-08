<script setup lang="ts">
import { onMounted, watchEffect } from 'vue';
import Header from './components/constants/Header.vue';
import Loader from './components/utitlities/Loader.vue';
import useMode from './pinia/mode'
import { useRoute } from 'vue-router';
import { useUser } from './pinia/user';
import { createToastPromise } from './composables';
import { getRefreshToken } from './composables/env';
const mode = useMode()
const route = useRoute()
const user = useUser()

const fullScreenRoutes = [
   'auth'
]

watchEffect(() => {
   if (fullScreenRoutes.includes(route.name as string)) {
      mode.hideHeader()
   } else {
      mode.showHeader()
   }
})


onMounted(async () => {
   if (await getRefreshToken()) {
      createToastPromise(user.getUserData, 'Getting User Data...', false)()
   }
})

</script>

<template>
   <Header v-if="false || mode.modeHeader" />
   <Loader />

   <RouterView />
</template>

<style lang="scss">

</style>
