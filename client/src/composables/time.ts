import { QuizTypes } from "types"

export const Time = {

   parseTime: (x: number) => x >= 10 ? `${x}` : `0${x}`,

   secondsToTime(x: number): QuizTypes.Time {
      const m = Math.floor(x / 60)
      const s = x - (m * 60)
      return { m: Time.parseTime(m), s: Time.parseTime(s) }
   },

   timeToSeconds(input: QuizTypes.Time) {
      const r = ((Number(input.m) ?? 0) * 60) + (Number(input.s) ?? 0)
      return r
   }

}