import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const genArray = (x: number) => {
   const isValid = typeof x === 'number' && x > 0
   if (!isValid) throw Error('invalid input')
   const array: number[] = []
   for (let i = 1; i <= x; i++) {
      if (!array.includes(i)) array.push(i)
   }
   return array
}

const genListFromArray = (input: number[]) => {

   return input.map(n => html`<span class="btn ${n === 1 ? 'on' : ''}">${n}</span>`)

}

const genCode = (x: number) => {
   const array = genArray(x)
   return genListFromArray(array)
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('quiz-nav')
export class QuizNav extends LitElement {
   @property({
      hasChanged: (val) => {
         const isValid = typeof val === 'number' && val >= 0
         return isValid
      }
   })
   numbers?: number = 40


   render() {
      return html`
         <nav class="nav" role="navigation">
            <div class="content">
               ${genCode(this?.numbers!)}
            </div>
         </nav>
      `
   }

   protected updated() {
      const spans = Array.from(this.shadowRoot!.querySelectorAll('span.btn')) as HTMLSpanElement[]

      spans.forEach(span => {
         span.addEventListener('click', _ => {
            this.dispatchEvent(new CustomEvent('navTabbed', {
               "bubbles": true,
               detail: {
                  number: Number(span.textContent)
               }

            }))
         }, false)
      })
   }

   disconnectedCallback(): void {
      super.disconnectedCallback()
      const spans = Array.from(this.shadowRoot!.querySelectorAll('span.btn')) as HTMLSpanElement[]

      spans.forEach(span => {
         span.removeEventListener('click', _ => { })
      })
   }






   tab(x: number) {
      const isValid = typeof x === 'number' && x >= 0 && x <= this?.numbers!
      if (!isValid) throw Error('invalid error')

      const spans = Array.from(this.shadowRoot!.querySelectorAll('span.btn')) as HTMLSpanElement[]

      spans.map((span) => {
         if (span.textContent === `${x}`) { span.classList.add('on') }
         else { span.classList.remove('on') }
      })

   }


   static styles = css`
   nav.nav {
      width: var(--w, min(500px, 70vw));
      font-size: var(--size, 12px);
      font-weight: var(--weight, 400);
      font-family: var(--fmly, "Work Sans");
      display: grid;
      grid-template-columns: minmax(var(--gp, 1.7em), 1fr) minmax(0, var(--w-c, 800px)) minmax(var(--gp, 1.7em), 1fr);
      padding-block: var(--pbl, var(--gp, 1.7em));
      row-gap: var(--gap, 2em);
      background: var(--bg, rgba(0, 0, 0, 0.03));
    }

    nav.nav > * {
      grid-column: 2 / -2
    }

    nav.nav .content {
      font-size: var(--size, 17px);
      font-weight: var(--weight, 400);
      font-family: var(--fmly, "Urbanist");
      display: grid;
      padding-block: var(--pbl, var(--p, 1.5rem));
      padding-inline: var(--pin, var(--p, 0.5rem));
      row-gap: var(--gap, 2em);
      grid-auto-columns: var(--w-span, 40px);
      grid-auto-rows: var(--w-span, 40px);
      grid-template-columns: repeat(auto-fit, var(--w-span, 40px));
      width: var(--w, min(700px, 90vw));
      column-gap: var(--gap-c, 1em);
      row-gap: var(--gap-r, 1em);
      background: var(--bg, rgba(0, 0, 0, 0.03));
      place-items: center;
      place-content: center;
    }
    nav.nav * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    nav.nav .content > span.btn {
      width: 100%;
      height: 100%;
      font-size: 1em;
      background: var(--bg-span, rgba(0, 0, 0, 0.024));
      color: var(--clr-span, rgb(0, 0, 0));
      border: var(--border-width, 0.4px) solid;
      border-color: var(--border-color, rgba(0, 0, 0, 0.3));
      display: grid;
      place-items: center;
      cursor: pointer;
      border-radius: var(--br, 1vmax);
      transition: 0.2s ease;
    }
    nav.nav .content > span.btn:hover {
      background: var(--bg-span-h, rgba(0, 0, 0, 0.08));
      color: var(--clr-span-h, rgb(0, 0, 0));
    }
    nav.nav .content > span.btn.on {
      background: var(--bg-span-on, rgba(0, 0, 0, 0.8));
      color: var(--clr-span-on, rgb(244, 244, 243));
    }
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-nav': QuizNav
   }
}
