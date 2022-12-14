import { DocumentTypes, QuizTypes, UserTypes } from "types"
import { sleep, useModal, useToast } from "."
import { Option, } from "../lit/quiz-options"
// import { ClientMdLib } from "md"

interface QuizElements {
   quizPage: HTMLDivElement,
   quizTimer: HTMLElementTagNameMap["quiz-timer"],
   quizOptions: HTMLElementTagNameMap["quiz-options"],
   quizMiniNav: HTMLElementTagNameMap["quiz-mininav"],
   quizNav: HTMLElementTagNameMap["quiz-nav"],
   quizNumber: HTMLElementTagNameMap["quiz-number"],
   quizQuestion: HTMLElementTagNameMap["quiz-question"],
   quizProfile: HTMLElementTagNameMap["quiz-profile"]
}

interface ClientAnswer {
   answer: string,
   sid: string
}

export interface QuizData {

   time: number,
   mode: QuizTypes.Mode,
   questionsDoc: DocumentTypes.Question,
   quizDoc: QuizTypes.QuizMetadata,
   userDoc: UserTypes.ClientUserMetadata

}


export class ClientQuiz {
   index: number
   answers: ClientAnswer[]
   interval: number
   isSubmitted: boolean
   timeIsRunning: boolean

   constructor(
      private elements: QuizElements,
      private data: QuizData
   ) {
      this.index = 0
      this.answers = []
      this.interval = 0
      this.timeIsRunning = false
      this.isSubmitted = false
   }


   init() {
      this.elements.quizProfile.data = {
         img: "",
         email: this.data.userDoc.email,
         name: this.data.userDoc.name
      }

      return this
   }

   start() {
      this.data.questionsDoc.data = this.data.questionsDoc.data.sort((a, b) => Math.random() - 0.5).map(q => {
         return { ...q, options: q.options.sort((a, b) => Math.random() - 0.5) }
      })
      this.elements.quizTimer.time = this.data.time
      this.elements.quizTimer.start()
      this.timeIsRunning = true

      this.index = 0
      this.elements.quizNav.numbers = this.data.questionsDoc.data.length
      this.elements.quizNumber.numbers = this.data.questionsDoc.data.length

      this.listen()
      this.syncCurrentQuestion()
   }


   listen() {

      this.elements.quizTimer.addEventListener('quizTimerStopped', () => {
         this.timeIsRunning = false
         const submitEvt = new CustomEvent('quiz-submit', { detail: { answers: this.answersArray }, bubbles: true }) as HTMLElementEventMap["quiz-submit"]
         this.elements.quizQuestion.dispatchEvent(submitEvt)
         useToast().el.show(`Time is done! Submitting answers`, false)
      })

      this.elements.quizNav.addEventListener('navTabbed', (e: any) => {
         this.index = Number(e?.detail?.number - 1) ?? 0 as number
         this.syncCurrentQuestion()
      })

      this.elements.quizMiniNav.addEventListener('miniNavClick', (e: any) => {
         (e?.detail?.toPrev as boolean === true) ? this.toPrevQuestion() : this.toNextQuestion()
      })

      this.elements.quizMiniNav.addEventListener('miniNavSubmit', (e: any) => {
         this.promptSubmitQuiz()
      })

      this.elements.quizOptions.addEventListener('optionClick', async (e: any) => {
         this.chooseAnswer(e?.detail?.option as string)
         await sleep(200)
         this.toNextQuestion()
      })
   }





   removeListeners() {
      this.elements.quizTimer.removeEventListener('quizTimerStopped', _ => { })
      this.elements.quizNav.removeEventListener('navTabbed', _ => { })
      this.elements.quizMiniNav.removeEventListener('miniNavClick', _ => { })
      this.elements.quizMiniNav.removeEventListener('miniNavSubmit', _ => { })
      this.elements.quizOptions.removeEventListener('optionClick', _ => { })
      this.elements.quizPage.removeEventListener('quiz-submit', _ => { })
      this.elements.quizTimer.shutdown()



   }






   toNextQuestion() {
      this.index = this.data.questionsDoc.data.length > this.index + 1 ? this.index += 1 : 0
      this.syncCurrentQuestion()
   }

   toPrevQuestion() {
      this.index = this.index <= 0 ? this.data.questionsDoc.data.length - 1 : this.index -= 1
      this.syncCurrentQuestion()
   }

   chooseAnswer(answer: string) {

      if (!this.timeIsRunning) throw Error('time is done')
      const sid = this.currentQuestion.sid
      const obj = { answer, sid }
      const i = this.answers.findIndex(a => a?.sid === sid)
      if (i === -1) this.answers.push(obj)
      else this.answers[i] = obj

      this.syncCurrentQuestion()


   }

   get currentQuestion() {
      const i = (this.data.questionsDoc.data.length > this.index) ? this.index : 0
      return this.data.questionsDoc.data[i]
   }

   get genOptionsObject() {
      const options: Option[] = [];
      this.currentQuestion.options.forEach(o => {
         const option: Option = { option: o }
         const i = this.answers.find(a => (a.sid === this.currentQuestion.sid) && (o === a.answer))
         if (i) option.on = true
         options.push(option)
      })
      return options
   }


   get answersArray() {

      const answers = [] as QuizTypes.Answer[]

      this.answers.forEach(a => {
         answers.push({ answer: a.answer, sid: a.sid })
      })

      return answers

   }


   async syncCurrentQuestion() {

      this.elements.quizNav.tab(this.index + 1)
      this.elements.quizNumber.tab(this.index + 1)

      this.elements.quizOptions.options = this.genOptionsObject
      this.elements.quizQuestion.question = this.currentQuestion.q
      this.fillQuestion()

   }


   async fillQuestion() {
      let slotMarkup = ``
      if (this.currentQuestion.info! > '') {
         const { ClientMdLib } = await import("md");
         const md = await ClientMdLib.mdToHtml(this.currentQuestion.info!)
         slotMarkup += md
      }

      if (this.currentQuestion.image! > '') {
         const imgHTML = `<img src=${this.currentQuestion.image} alt>`
         slotMarkup += imgHTML
      }

      this.elements.quizQuestion.innerHTML = slotMarkup
   }

   promptSubmitQuiz() {
      const { isValidMsg, isValid } = this.checkSubmitQuestionNumber()

      if (!isValid) {
         const toast = useToast()
         toast.el.show(isValidMsg, true)
         throw Error(isValidMsg)
      }


      const submitEvt = new CustomEvent('quiz-submit', {
         detail: { answers: this.answersArray },
         bubbles: true
      }) as HTMLElementEventMap["quiz-submit"]


      this.elements.quizQuestion.dispatchEvent(submitEvt)



   }


   checkSubmitQuestionNumber() {
      const percent = 100 * (this.answers.length / this.data.questionsDoc.data.length)
      const isValid = percent >= 50
      const isValidMsg = isValid ? `You can submit now` : `You cannot submit less than 50% of the questions answered. You have completed ${this.answers.length} out of ${this.data.questionsDoc.data.length}`


      return { isValid, percent, isValidMsg }
   }


}

export { }


interface QuizSubmitEvent extends Event {
   detail: {
      answers: QuizTypes.Answer[]
   },
   bubbles: boolean
}



//TODO : add typings for the quiz-submit event
declare global {
   interface HTMLElementEventMap {
      "quiz-submit": QuizSubmitEvent
   }
}
