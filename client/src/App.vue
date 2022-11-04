<script setup lang="ts">
import Header from '@/components/constants/Header.vue';
import useMode from './pinia/mode'

const mode = useMode()

</script>

<template>
   <Header v-if="mode.modeAuth" />
   <RouterView />
</template>

<style lang="scss">

</style>
