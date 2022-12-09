import { QuizTypes } from "../types"

export const sleep = (ms = 2000) => { return (new Promise(r => setTimeout(r, ms))) };

export const Time = {

   parseTime: (x: number) => x >= 10 ? `${x}` : `0${x}`,

   secondsToTime(x: number): { m: string, s: string } {
      const m = Math.floor(x / 60)
      const s = x - (m * 60)
      return { m: Time.parseTime(m), s: Time.parseTime(s) }
   },

   timeToSeconds(input: QuizTypes.Time) {
      const r = ((Number(input.m) ?? 0) * 60) + (Number(input.s) ?? 0)
      return r
   }

}

export const str = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (typeof arg === 'string')
   }, true) as boolean
}


export const num = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (typeof arg === 'number')
   }, true) as boolean
}


export const arr = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (Array.isArray(arg))
   }, true) as boolean
}


export const arrStr = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (arg.reduce(str))
   }, true)
}

export const arrFunc = (func: Function, ...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (arg.reduce(func))
   }, true)
}



