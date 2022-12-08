import { html } from "lit"
import { DocumentTypes, QuizTypes, UserTypes } from "types"
import { useModal, useToast } from "."
import { QuizMiniNav } from "../lit/quiz-mininav"
import { QuizNav } from "../lit/quiz-nav"
import { QuizNumber } from "../lit/quiz-number"
import { Option, QuizOptions } from "../lit/quiz-options"
import { QuizProfile } from "../lit/quiz-profile"
import { QuizQuestion } from "../lit/quiz-question"
import { QuizTimer } from "../lit/quiz-timer"
// import { ClientMdLib } from "md"

interface QuizElements {
   quizPage: Element
   quizTimer: QuizTimer
   quizOptions: QuizOptions
   quizMiniNav: QuizMiniNav
   quizNav: QuizNav
   quizNumber: QuizNumber
   quizQuestion: QuizQuestion
   quizProfile: QuizProfile
}

interface ClientAnswer {
   answer: string,
   sid: string
}

export interface QuizData {

   time: number,
   mode: QuizTypes.Mode,
   questionsDoc: DocumentTypes.Question,
   quizDoc: DocumentTypes.Quiz,
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
      this.data.questionsDoc.data = this.data.questionsDoc.data.map(q => {
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
      })

      this.elements.quizNav.addEventListener('navTabbed', (e: any) => {
         this.index = Number(e?.detail?.number - 1) ?? 0 as number
         this.syncCurrentQuestion()
      })

      this.elements.quizMiniNav.addEventListener('miniNavClick', (e: any) => {
         (e?.detail?.toPrev as boolean === true) ? this.toPrevQuestion() : this.toNextQuestion()
      })

      this.elements.quizMiniNav.addEventListener('miniNavSubmit', (e: any) => {
         console.log(e)
         this.promptSubmitQuiz()
      })

      this.elements.quizOptions.addEventListener('optionClick', (e: any) => {
         this.chooseAnswer(e?.detail?.option as string)
      })
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

      const answers = {
         qid: this.data.quizDoc._id as string,
         data: [] as QuizTypes.Answer[]
      }

      this.answers.forEach(a => {
         answers.data.push({
            answer: a.answer,
            sid: a.sid,
            qid: answers.qid
         })
      })

      return answers

   }


   async syncCurrentQuestion() {
      // console.log(ClientMdLib)

      this.elements.quizNav.tab(this.index + 1)
      this.elements.quizNumber.tab(this.index + 1)

      this.elements.quizOptions.options = this.genOptionsObject
      this.elements.quizQuestion.question = this.currentQuestion.q

   }


   // async fillQuestion() {
   //    this.elements.quizQuestion.question = questionObject.q
   // optionEl.options = getProcessedOptions(questionObject.options)
   // let slotMarkup = ``
   // if (this.elements.quizQuestion?.info! > '') {
   //    const md = await ClientMdLib.mdToHtml(this.elements.quizQuestion?.info!)
   //    slotMarkup += md
   // }

   // if (this.elements.quizQuestion?.image! > '') {
   //    const imgHTML = `<img src=${this.elements.quizQuestion.image} alt>`
   //    slotMarkup += imgHTML
   // }

   // this.elements.quizQuestion.innerHTML = slotMarkup
   // }

   promptSubmitQuiz() {
      const { isValidMsg, isValid } = this.checkSubmitQuestionNumber()

      if (!isValid) {
         const toast = useToast()
         toast.el.show(isValidMsg, true)
      }



   }


   checkSubmitQuestionNumber() {
      const percent = 100 * (this.answers.length / this.data.questionsDoc.data.length)
      const isValid = percent >= 70
      const isValidMsg = isValid ? `You can submit now` : `You cannot submit less than 70% of the questions answered. You have completed ${this.answers.length} out of ${this.data.questionsDoc.data.length}`


      return { isValid, percent, isValidMsg }
   }


}

export { }
