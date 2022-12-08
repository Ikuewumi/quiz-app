<template>
   <div data-c-user-update-metadata data-p>
      <form class="dis-grid g-5">
         <div class="img">
            <img :src="userData.image" v-if="userData.image" alt="user_profile_picture">

            <span class="btn-bar">
               <button type="button" @click="LogicClass.showFilePicker">
                  <svg class="edit" viewBox="0 0 128 128">
                     <use href="#edit_metro"></use>
                  </svg>
               </button>

               <button type="button" v-if="userData.image" @click="imageMethods.deleteImage">
                  <svg viewBox="0 0 26 26">
                     <use href="#delete_metro"></use>
                  </svg>
               </button>
            </span>


         </div>
         <main class="dis-grid g-5">
            <input name="name" ref="nameInput" type="text" placeholder="Enter your name" required>
            <input type="file" @change="imageMethods.changeImage" accept="image/*" ref="hiddenImageInput" hidden>
            <textarea name="description" ref="descriptionInput"
               placeholder="Description is optional, (but if put in, it must be at least 30 characters)"
               required></textarea>
            <button-component @click="checkSubmit" role="button" aria-label="button" content="Update">
            </button-component>
         </main>
      </form>
   </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ReactiveVariable } from 'vue/macros';
import { UserMetadataLogic } from '../../composables/userMetadata';
import { useUser } from '../../pinia/user';

const emit = defineEmits<{
   (event: 'submitForm', payload: InputMetadata): void
}>()


let LogicClass: ReactiveVariable<UserMetadataLogic> = $ref(null as any)

const userData: ReactiveVariable<InputMetadata> = $ref({
   name: '', description: '', image: ''
})



//elements
const hiddenImageInput = $ref(null)
const nameInput = $ref(null)
const descriptionInput = $ref(null)


//store
let store = useUser()





const checkSubmit = async () => {

   const data: InputMetadata = await LogicClass.checkSubmit(userData.image)
   emit('submitForm', data)

}







const imageMethods = {
   async changeImage() {
      const imgString = await LogicClass.showImg()
      userData.image = imgString
   },

   async deleteImage() {
      userData.image = ''
   }
}




onMounted(async () => {

   LogicClass = new UserMetadataLogic(
      hiddenImageInput as unknown as HTMLInputElement,
      nameInput as unknown as HTMLInputElement,
      descriptionInput as unknown as HTMLTextAreaElement
   )


   //get latest user metadata
   await store.getUserData()


   LogicClass.data = { name: store.name, description: store.description, image: store.image }
   userData.image = store.image
   LogicClass.init()


   //removing this store object
   store = null as unknown as typeof store

})


onUnmounted(() => { LogicClass = null as unknown as UserMetadataLogic })









</script>

<style lang="scss">
@use '../../scss/mixins/input.scss' as *;

[data-c-user-update-metadata] {
   width: 100%;
   --img-width: 170px;

   row-gap: var(--size-4);

   .img {
      width: min(var(--img-width), 50vw);
      aspect-ratio: 1 / 1;
      background: rgb(255, 255, 255);
      outline: 1px solid rgb(0 0 0 / 0.05);
      outline-offset: -2px;
      border-radius: 0.2vmax;
      position: relative;
      overflow: hidden;

      img {
         object-fit: cover;
         width: 100%;
         height: 100%;
      }

      span.btn-bar {
         --offset: 10px;

         position: absolute;
         inset: auto auto var(--offset) var(--offset);
         display: flex;
         gap: 0.2em;

         button {

            aspect-ratio: 1 / 1;
            cursor: pointer;
            @include card;
            --pbl: 3px;
            --pin: 3px;
            --w: 35px;
            --bg: rgb(255 255 255 / 0.3);
            --bg-h: rgb(255 255 255 / 0.5);
            --fill: #222;
         }

      }
   }



   input,
   textarea {
      @include card;
      @include input;
      --pbl: 0.7rem;
      --pin: 0.7rem;
      --border-color: #00000040;
      --bg: transparent;
      --bg-h: transparent;
      --clr: #000;
      --clr-h: #000;
   }

   textarea {
      resize: vertical;
      min-height: 140px;
   }

   button-component {
      --pbl: 0.6rem;
      --pin: 1.8rem;
      justify-self: right;
   }

   .tags {
      display: flex;
      width: fit-content;
      flex-wrap: wrap;
      place-items: center;
      cursor: pointer;
      gap: var(--size-3);

      span {
         @include card;
         flex-basis: fit-content;
         display: flex;
         place-items: center;
         gap: var(--size-5);
         --pin: 0.5rem;
      }

      span svg {
         @include mSvg;
         --w: 15px;
         --f: #555;
      }
   }

   form {
      display: grid;
   }

   @media (max-width: 800px) {}


   @media (min-width: 800px) {
      .img {
         grid-column: 1 / 2;
      }

      form {
         grid-template-columns: var(--img-width) 1fr;

         * {
            grid-column: 2 / -1;
         }
      }
   }

}
</style>