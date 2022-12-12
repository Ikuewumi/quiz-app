import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Time } from '../composables/time'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('quiz-timer')
export class QuizTimer extends LitElement {

   /**
    * A property to input the time the timer quiz is to run in s
    */
   @property({ hasChanged: (val) => QuizTimer.isNumber(val) })
   time?: number = 20

   @state()
   _isRunning?: boolean = false

   @state()
   _time?: number = 0

   @state()
   _timeInterval?: number = 0

   private static createDate(t: number) {
      return (new Date(Date.now() + t))
   }

   private static isNumber(val: any) {
      const r = Array.isArray(val) ? val.reduce((acc, curr) => acc && typeof curr === 'number', true) : typeof val === 'number'
      return r as boolean
   }

   start() {
      if (this._timeInterval !== 0) throw Error('there is already a timer in place. Please try again later')

      this._time = this.time
      const startingTime = this._time
      this._isRunning = true
      const timeToEnd = QuizTimer.createDate(this._time!)
      this._timeInterval = setInterval(() => {
         if (this._timeDone(timeToEnd)) {
            this.stop()
         }
         else {
            this._time! -= 1;
            this._checkStatus(startingTime!)
            this.requestUpdate()
         }
      }, 1000)
   }

   stop() {
      let completed = this._time === 0
      clearInterval(this._timeInterval)
      this._isRunning = false
      this._timeInterval = 0
      this.dispatchEvent(new CustomEvent('quizTimerStopped', {

         detail: {
            completed
         }

      }))
      this.shadowRoot?.querySelector('time')?.classList.remove(...['yellow', 'red'])
      this.shadowRoot?.querySelector('time')?.classList.add('done')
   }

   shutdown() {
      let completed = this._time === 0
      clearInterval(this._timeInterval)
      this._isRunning = false
      this._timeInterval = 0
      this.shadowRoot?.querySelector('time')?.classList.remove(...['yellow', 'red'])
      this.shadowRoot?.querySelector('time')?.classList.add('done')
   }

   private _checkStatus(t: number) {
      const percent = (this._time! / t) * 100
      let cssClass = ''

      if (percent >= 70) {
         cssClass = ''
      } else if (percent >= 40) {
         cssClass = 'yellow'
      } else {
         cssClass = 'red'
      }

      this.shadowRoot?.querySelector('time')?.classList.remove(...['yellow', 'red'])
      if (cssClass > '') this.shadowRoot?.querySelector('time')?.classList.add(cssClass)



   }

   private _timeDone(t: Date) {
      return ((Date.now() > t.getMilliseconds()) && (this._time! <= 0))
   }


   render() {
      return html`
         <time class="time">
            <span class="hour">${Time.secondsToTime(this._time!).m}</span>
            <span class="minuite">${Time.secondsToTime(this._time!).s}</span>
         </time>
      `
   }

   static styles = css`
   time {
      display: flex;
      font-family: var(--fmly, "Urbanist");
      font-size: var(--size, 17px);
      font-weight: var(--weight, 700);
      align-items: stretch;
      height: var(--h, 4ch);
      outline: 1px solid var(--br, hsla(0deg, 0%, 0%, 0.067));
      outline-offset: var(--offset, 2px);
      gap: 1.5px;
    }
    time * {
      margin: 0;
      padding: 0;
    }
    time > span {
      display: grid;
      place-items: center;
      padding-inline: var(--p-in, 0.8em);
      background: var(--bg, rgba(0, 0, 0, 0.05));
      color: var(--clr, #000);
      font-size: 1em;
    }

    time.yellow > span {
      background: var(--bg-y, #ABA20070 );
    }

    time.red > span {
      background: var(--bg-r, #E3494370 );
    }

    time.done > span {
      background: var(--bg-done, #FF4943 );
      color: var(--clr-done, #FFF);
    }
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-timer': QuizTimer
   }
}
