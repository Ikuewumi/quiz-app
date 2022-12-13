<template>
   <div data-c-user-metadata>
      <div class="img">
         <img v-if="props.user.image" :src="props.user.image" alt="user_image">
      </div>
      <h1>{{ props.user.name }}</h1>
      <p>{{ props.user.email }}</p>
      <p class="description" v-if="props.user.description">{{ props.user.description }}</p>
      <small data-text-admin @click="emit('toAdmin')" v-if="props.user.admin">Admin</small>
      <small data-text-edit @click="emit('editProfile')" v-if="props.showEdit">
         <svg viewBox="0 0 26 26">
            <use href="#edit_metro"></use>
         </svg>
      </small>

      <!-- UserMetadata -->
   </div>
</template>

<script setup lang="ts">
import { UserTypes } from 'types';

const props = defineProps<{
   user: UserTypes.UserMetadata,
   showEdit: Boolean
}>()

const emit = defineEmits<{
   (event: 'editProfile'): void,
   (event: 'toAdmin'): void,
}>()
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;


[data-c-user-metadata] {
   --c-br: 0.5vmax;

   border-radius: var(--c-br);
   width: 100%;
   background: var(--p-bg, rgba(151, 194, 223, 0.705));
   padding-inline: var(--p-pin, 0);
   padding-block: var(--p-pbl, 2.4rem 3.5rem);
   display: grid;
   place-items: center;
   gap: var(--p-gap, 0.6rem);
   position: relative;

   text-align: center;





   small {

      border-radius: var(--c-br);
      position: absolute;
      padding: var(--p-pbl, 0.4rem) var(--p-pin, 1.3rem);
      background: var(--p-bg);

      cursor: pointer;
      font-family: var(--a-f, 'Urbanist');
      font-weight: var(--a-weight, 700);
      transition: 0.2s ease;




      &[data-text-admin] {
         --p-bg: hsl(55, 56%, 56%);
         color: #000;
         inset: 0 auto auto 0;
         transform-origin: right;
         transform: translateX(-20%) translateY(-40%) rotate(-25deg);

         &:hover {
            background: hsl(55, 56%, 66%);
            color: #fff;
         }
      }

      &[data-text-edit] {
         color: #000;
         inset: 0 0 auto auto;
         --p-pbl: 10px;
         --p-pin: 10px;
         --f-h: #444;
         --f: #000;

         --p-bg-h: rgb(0 0 0 / 0.2);
         --p-bg: rgb(0 0 0 / 0.06);

         svg {
            @include mSvg;
            --w: 20px;



         }

         &:hover {
            // background: hsl(55, 56%, 66%);
            // color: #fff;


         }
      }




      &:hover {
         background: var(--p-bg-h, var(--p-bg));
         // color: #fff;
      }


   }






   .img {
      @include mSvg;
      --w: 120px;
      --aspect: 1;
      --bg: #fff;
      --bg-h: #fff;
      border-radius: 50%;
      outline: 2px solid #777;
      overflow: hidden;



      img {
         max-width: 100%;
         object-fit: cover;
         width: 100%;
         height: 100%;
      }
   }


   h1 {
      font-family: var(--a-f, 'Urbanist');
      font-weight: var(--a-weight, 700);
   }


   p.description {
      font-size: 0.85em;
   }


}
</style>