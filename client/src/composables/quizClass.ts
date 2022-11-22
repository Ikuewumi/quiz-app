import { QuizTypes } from "types"
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


export class ClientQuiz {
   index: number
   answers: ClientAnswer[]
   interval: number
   timeIsRunning: boolean

   constructor(
      private elements: QuizElements,
      private data: QuizTypes.ClientQuiz
   ) {
      this.index = 0
      this.answers = []
      this.interval = 0
      this.timeIsRunning = false
   }


   init() {
      this.elements.quizProfile.data = {
         img: "",
         email: this.data.user.email,
         name: this.data.user.name
      }

      return this
   }

   start() {
      this.elements.quizTimer.time = this.data.time
      this.elements.quizTimer.start()
      this.timeIsRunning = true

      this.index = 0
      this.elements.quizNav.numbers = this.data.questions.length
      this.elements.quizNumber.numbers = this.data.questions.length

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

      this.elements.quizOptions.addEventListener('optionClick', (e: any) => {
         this.chooseAnswer(e?.detail?.option as string)
      })
   }

   toNextQuestion() {
      this.index = this.data.questions.length > this.index + 1 ? this.index += 1 : 0
      this.syncCurrentQuestion()
   }

   toPrevQuestion() {
      this.index = this.index <= 0 ? this.data.questions.length - 1 : this.index -= 1
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
      const i = (this.data.questions.length > this.index) ? this.index : 0
      return this.data.questions[i]
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
         qid: this.data.metadata.qid as string,
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


}

export { }
