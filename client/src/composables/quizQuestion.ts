import { ReactiveVariable } from "vue/macros";
import { QuizTypes } from "types";
import { useToast } from ".";
import { fileToDataUrl } from "./img";
import { StoreTypings } from "../pinia/quizQuestion";
import { Store, StoreDefinition } from "pinia";
// import { ClientMdLib } from "md"
import { html } from "lit";


export class QuizQuestionLogic {
   constructor(
      public editImgBtn: ReactiveVariable<HTMLButtonElement>,
      public hiddenImgInput: ReactiveVariable<HTMLInputElement>,
      public questionInput: ReactiveVariable<HTMLInputElement>,
      public optionsInput: ReactiveVariable<HTMLTextAreaElement>,
      public moreInfoInput: ReactiveVariable<HTMLInputElement>,
      public refs: Store<"useQuizQuestion", {
         refs: StoreTypings;
      }, {}, {
         resetRefs(data?: StoreTypings): void;
         setImgRef(str?: string): void;
      }>,
      public store: PiniaStores["creation"],
      public config = {
         imgLimit: 100
      },
      public data?: QuizTypes.Q,
   ) { }


   async fillFields() {
      this.checkforCurrentQuestion()

      const currentQuestion = this.store.getCurrentQuestion
      this.questionInput.value = currentQuestion?.q ?? ''
      this.optionsInput.value = currentQuestion.options.join(`\n`) ?? ''
      if (currentQuestion?.info! > "") {
         this.moreInfoInput.value = currentQuestion.info ?? ''
      }
   }

   static async parseMd(mdInput: string) {
      const { ClientMdLib } = await import("md")
      const html = await ClientMdLib.mdToHtml(mdInput)
      let testEl = document.createElement('div')
      testEl.innerHTML = html
      const p = testEl.querySelector('p')

      return {
         p
      }
   }



   init() {
      this.fillFields()
      return this
   }

   get currentQuestion() {
      return this.store.getCurrentQuestion!
   }

   fillSomeFields() {
      this.checkforCurrentQuestion()

      const md = this.createMoreInfoMd() ?? null
      const result = {
         ...this.currentQuestion,
         "q": this.questionInput.value,
         "options": this.textToOptions(this.optionsInput.value)
      } as QuizTypes.ClientQuestion

      if (md) result.info = md
      if (this.store.getCurrentQuestion.image! > '') result.image = this.store.getCurrentQuestion.image!

      this.store.quizData[this.store.currentIndex] = result

   }

   showFilePicker() {
      this.hiddenImgInput.click()
   }

   checkforCurrentQuestion() {
      const isValid = typeof this.store.getCurrentQuestion?.q === 'string'
      if (!isValid) throw Error('no current question')
   }

   async showImg() {
      try {
         this.checkforCurrentQuestion()

         if (!this.hiddenImgInput.files) throw Error('no file present!')
         const file = this.hiddenImgInput.files[0]
         if (!file) throw Error('no file present!')
         const imgIsValid = file.size <= (this.config.imgLimit * 1000)
         if (!imgIsValid) throw Error(`This image is too large. Images must be less than ${this.config.imgLimit}kb`)

         const string = await fileToDataUrl(file)
         this.fillSomeFields()
         this.store.getCurrentQuestion.image = string
         return string

      } catch (e) {
         this.showMsg(e)
         throw Error(e as string)
      }
   }

   async checkSubmit() {
      try {
         await this.checkIfFieldsAreValid()
         this.checkforCurrentQuestion()

         const md = this.createMoreInfoMd() ?? null
         const result = {
            "q": this.questionInput.value,
            "options": this.textToOptions(this.optionsInput.value)
         } as QuizTypes.ClientQuestion
         if (md) result.info = md
         if (this.store.getCurrentQuestion.image! > '') result.image = this.store.getCurrentQuestion.image!
         this.store.quizData[this.store.currentIndex] = result

         return result
      }
      catch (e) {
         this.showMsg(e, true)
         throw Error(e as string)
      }
   }

   createMoreInfoMd() {
      let md = this.moreInfoInput.value.trim() ?? ''
      return md
   }


   async checkIfFieldsAreValid() {
      const titleIsValid = this.questionInput.value.trim() > ''
      const optionsIsValid = this.optionsInput.value.trim() > ''
      const optionsIsArray = this.textToOptions(this.optionsInput.value).length >= 2
      const isValid = titleIsValid && optionsIsValid && optionsIsArray
      let msg: string = ''
      let isErr: boolean = true

      if (!isValid) {
         isErr = true
         if (!titleIsValid) msg = 'No question. Please fill it'
         else if (!optionsIsValid) msg = 'Options is a required field. Please fill it'
         else if (!optionsIsArray) msg = 'the options must be at least more than one'
         throw Error(msg)
      } else {
         isErr = false
         msg = "Valid Submit"
         this.showMsg(msg, false)
         return {
            isValid
         }
      }
   }


   textToOptions(text: string) {
      const array = text.split('\n').map(t => t.trim()).filter(t => t > '')
      const processsed = Array.from(new Set(array))
      return processsed
   }

   optionsToText(array: string[]) {
      const text = array.join('\n')
      return text
   }


   removeImg() {
      this.refs.$state.refs.img = ''
   }


   showMsg(e: any, isErr = true) {
      const toast = useToast()
      const err = e.toString() === '[object Object]' ? 'An error occured! That\'s all we know' : e.toString()
      toast.el.show(err, isErr)
   }




}