<template>
   <footer data-c-footer class="even-cols sgrid">
      <div role="presentation">

         <div class="image">
            <svg viewBox="0 0 844.67538 595.26155">
               <use href="#question_svg"></use>
            </svg>
         </div>
         <section>
            <RouterLink to="/">home</RouterLink>
            <RouterLink style="--c: #C678E0" to="/">quizzes</RouterLink>
            <RouterLink style="--c: #E76A43" to="/user">you</RouterLink>
         </section>

         <p>Copyright &copy; iKAY 2022</p>
      </div>
   </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style lang="scss">
[data-c-footer] {
   --col-start: 2;
   --col-width: 6;
   --img-w: min(80px);

   row-gap: var(--size-6);
   height: min-content;


   &>* {
      grid-column: 2/ -2
   }

   >div {
      display: grid;
      place-items: center;
      row-gap: var(--size-2);
      background: #fff;
      outline: 0.2px solid rgb(0 0 0 / 0.04);
      padding-block: 1.3rem 2.5rem;
      border-top-left-radius: 0.5vmax;
      border-top-right-radius: 0.5vmax;
   }


   .image {
      width: fit-content;
   }

   img,
   svg,
   figure {
      object-fit: contain;
      width: var(--img-w);
      height: var(--img-w);
   }


   section {
      display: flex;
      flex-wrap: wrap;
      place-items: center;
      gap: var(--size-3);

   }

   p {
      margin-top: var(--size-4);
      font-family: var(--f-big);
      font-weight: 700;
      color: #999;
   }


   a {
      color: var(--c, var(--clr-dlue));
      font-size: var(--f-size-s0);
      font-weight: 500;
      font-family: 'Urbanist';
      text-decoration: none;
      position: relative;
      line-height: .8;

      &::before {
         content: '';
         position: absolute;
         inset: auto auto 0 0;
         width: 100%;
         height: 0.5px;
         background: var(--c, var(--clr-dlue));
         transition: 0.4s ease;
         opacity: 0.6;


      }


      &:hover::before {
         height: 5px;
      }
   }
}
</style>