<template>
   <Dialog :show-dialog="dialogData.boolean" :text="dialogText" @no="dialogData.boolean = false" @yes="saveQuiz" />
   <div data-f-quiz-bar class="sgrid even-cols mb-7">
      <QuizBar :class-is-meta="booleans.metadata ?? true" @go-to-meta="navigate" />
   </div>
   <QuizMetadata @submitForm="storeMetadata" doneBtn="Save" v-if="booleans.metadata" />
   <QuizQuestionForm @newQuestion="saveAndCreateNewQuestion" @submitForm="saveQuestion" doneBtn="Save"
      v-if="booleans.question" />
   <div data-c-question-group class="sgrid even-cols" v-if="booleans.group">
      <QuizQuestionCardLong :isBar="true" class="" @createQuestion="createQuestion" />
      <QuizQuestionCardLong v-for="(q, i) in useCreation.quizData" @deleteQuestion="deleteQuestion(i)"
         @editQuestion="editQuestion(i)" @previewQuestion="previewQuestion(i)" :question="q" :index="i + 1" :key="i" />
      <ErrorComponent v-if="!useCreation.quizData.length" msg="No Questions Present" />
      <button @click="dialogData.boolean = true" data-f-save-questions>Save</button>
   </div>
   <div data-f-modal class="sgrid even-cols" v-if="booleans.preview">
      <QuizQuestionCard @stopPreview="stopPreviewQuestion" @prev-question="choosePreviewNumber(false)"
         @next-question="choosePreviewNumber(true)" />
   </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, computed, onUnmounted } from 'vue';
import { QuizCreationLogic } from '../../composables/quizCreate';
import { useQuizCreation } from '../../pinia/quizCreate';
import { createToastPromise, useToast, title } from '../../composables';
import { QuizTypes } from 'types';
import QuizMetadata from '../../components/admin/QuizMetadata.vue';
import QuizQuestionForm from '../../components/admin/QuizQuestionForm.vue';
import QuizQuestionCardLong from '../../components/admin/QuizQuestionCardLong.vue';
import QuizQuestionCard from '../../components/admin/QuizQuestionCard.vue';
import QuizBar from '../../components/admin/QuizBar.vue';
import Dialog from '../../components/utitlities/Dialog.vue';
import ErrorComponent from "../../components/utitlities/ErrorComponent.vue"
import { apiGet, apiPost, apiPut } from '../../composables/auth';
import { useRoute, useRouter } from 'vue-router';
import { zClientQuizWithQuestions, zQuizMetadata } from '../../composables/validator';
const sleep = (ms = 2000) => { return (new Promise(r => setTimeout(r, ms))) };

interface Booleans {
   [index: string]: boolean
}

let LogicClass = $ref(null as unknown as QuizCreationLogic)
const useCreation = useQuizCreation()
const route = useRoute()
const router = useRouter()
const isUpdateRoute = $computed(() => route.name === 'update')
const dialogData = $ref({ text: computed(() => isUpdateRoute ? 'Update quiz?' : 'Create New Quiz?'), boolean: false })
const dialogText = $computed(() => isUpdateRoute ? 'Update quiz?' : 'Create New Quiz?')


const booleans = $ref({
   metadata: true,
   question: false,
   group: false,
   preview: false
} as Booleans)

const chooseBool = (val: string) => {
   for (const elem in booleans) {
      booleans[elem] = false
      if (val.toLowerCase().trim() === elem) booleans[elem] = true
   }
}


const metadataPresent = () => {
   const isValid = useCreation.quizMetadata.title.trim() > '' && useCreation.quizMetadata.description.trim().length >= 30 && useCreation.quizMetadata.image.trim() > '' && useCreation.quizMetadata.tags.length >= 1
   return isValid
}


const navigate = (toMetadata: boolean) => {
   try {
      if (toMetadata) {
         chooseBool('metadata')
      } else {
         if (!metadataPresent()) {
            chooseBool('metadata')
            throw Error('metadata must be present')
         }
         LogicClass.clearUnusedQuestions()
         chooseBool('group')
      }
   } catch (err) {
      const toast = useToast()
      toast.el.show(String(err), true)
   }

}






onBeforeMount(() => {
   LogicClass = new QuizCreationLogic(useCreation)
})
onMounted(() => {


   createToastPromise(async () => {
      title('Create New Quiz')

      if (isUpdateRoute) {
         const id = route.params.id
         const a = await apiGet(`quiz/drafts/${id}`, true)

         useCreation.quizMetadata = zQuizMetadata.strip().parse(a)
         title(`Update ${useCreation.quizMetadata.title}`)
         useCreation.quizData = zClientQuizWithQuestions.pick({ questions: true }).parse(a).questions
      }


      chooseBool('metadata');
      navigate(true);

   }, 'Loading data...', true)()


})








const saveQuiz = () => {

   createToastPromise(async () => {
      const m = metadataPresent()
      if (!m) {
         navigate(true)
         throw Error('invalid metadata present')
      }

      LogicClass.clearUnusedQuestions()

      let id = ''

      const payloadObject = {
         metadata: useCreation.quizMetadata,
         questions: useCreation.quizData
      }


      if (!payloadObject.questions.length) throw Error('there must be at least one question present')

      if (isUpdateRoute) {
         const result = await apiPut(`quiz/update/${route.params.id}`, payloadObject)
         id = route.params.id! as string
      } else {
         const result = await apiPost('quiz/create', payloadObject)
         /**@ts-ignore */
         id = result._id

      }

      return router.push(`/admin/drafts/${id}`)



   }, 'saving quiz...', true)()


}




onUnmounted(() => { useCreation.$reset() })



const storeMetadata = (data: QuizTypes.QuizMetadata) => {
   LogicClass.storeMetadata(data)
   chooseBool('group')
   LogicClass.clearUnusedQuestions()
}
const createQuestion = () => {
   const isValid = useCreation.$state.quizData.length <= 100
   if (!isValid) {
      const msg = 'You cannot have more than 100 questions'
      useToast().el.show(msg)
      throw Error(msg)
   }
   LogicClass.createEmptyQuestion()
   chooseBool('question')

}
const saveQuestion = (q: QuizTypes.Q) => {
   LogicClass.saveQuestion(q)
   LogicClass.clearUnusedQuestions()

   chooseBool('group')

}

const saveAndCreateNewQuestion = (q: QuizTypes.Q) => {

   createToastPromise(async () => {
      LogicClass.saveQuestion(q)
      LogicClass.clearUnusedQuestions()
      chooseBool('group')
      await sleep(1000)
      createQuestion()
      chooseBool('question')

   }, 'Creating New Question', true)()


}
const deleteQuestion = (i: number) => {
   LogicClass.removeQuestion(i)
}
const previewQuestion = (i: number) => {
   if (useCreation.quizData.length - 1 >= i) useCreation.currentIndex = i
   chooseBool('preview')
}
const choosePreviewNumber = (toNext: boolean = false) => {
   let i = useCreation.currentIndex
   if (toNext) {
      if ((useCreation.quizData.length - 1) <= i) useCreation.currentIndex = 0
      else useCreation.currentIndex += 1
   } else {
      if ((i - 1) < 0) useCreation.currentIndex = useCreation.quizData.length - 1
      else useCreation.currentIndex -= 1
   }



}
const stopPreviewQuestion = () => {
   chooseBool('group')
}
const editQuestion = (i: number) => {
   if (useCreation.quizData.length - 1 >= i) useCreation.currentIndex = i
   chooseBool('question')
}
</script>

<style lang="scss">
@use "../../scss/mixins/input.scss" as *;

[data-c-question-group],
[data-f-quiz-bar],
[data-f-modal] {
   --col-start: 2;
   --col-width: 6;

   row-gap: var(--size-4);

   &>* {
      grid-column: 2 / -2;
   }
}


[data-f-save-questions] {
   @include buttons;
   justify-self: right;
   margin-top: var(--size-4);
   --pbl: 0.7rem;
   --pin: 2rem;
   --border-w: 0.1px;
   --border-color: rgb(0 0 0 / 0.1);
   --weight: 500;
}
</style>