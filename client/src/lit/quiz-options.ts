import { LitElement, css, html, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export interface Option {
   option: string
   on?: boolean
}


const genOption = (a: Option) => {

   return html`<span class="option ${a?.on ? 'on' : ''}">${a.option}</span>`

}


@customElement('quiz-options')
export class QuizOptions extends LitElement {

   @property({
      hasChanged: (val: Option[]) => {
         const isValid = val.reduce((acc, curr) => (acc && ('option' in curr) && (typeof curr?.option === 'string') && (curr?.option > '')), true)
         return isValid
      }
   })
   options?: Option[] = [
      { option: 'A  world of my making', on: true },
      { option: 'Good Life!' },
      { option: 'New heights with me' },
      { option: 'A nice necromancer' }
   ]

   /**
    * The number of times the button has been clicked.
    */
   @property({ type: Number })
   count = 0

   render() {
      return html`
         <article class="options" role="menu">
            ${this.options?.map(option => genOption(option))}
         </article>
      `
   }

   protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
      const options = Array.from(this.shadowRoot?.querySelectorAll('span.option')!) as HTMLSpanElement[]
      options.forEach(option => option.addEventListener('click', _ => {
         const chosenOption = this.options?.find(o => option.textContent === o.option)
         const event = new CustomEvent('optionClick', {
            detail: { option: chosenOption?.option },
            bubbles: true
         })
         this.dispatchEvent(event)
      }))
   }

   disconnectedCallback(): void {
      const options = Array.from(this.shadowRoot?.querySelectorAll('span.option')!) as HTMLSpanElement[]
      options.forEach(option => option.removeEventListener('click', _ => { }))
   }


   static styles = css`
   .options {
      font-size: var(--size, 13px);
      font-weight: var(--weight, 400);
      font-family: var(--fmly, "Work Sans");
      display: grid;
      grid-template-columns: minmax(var(--gp, 1.7em), 1fr) minmax(0, var(--w-c, 800px)) minmax(var(--gp, 1.7em), 1fr);
      padding-block: var(--pbl, var(--gp, 1.7em));
      row-gap: var(--gap, 1.4em);
      background: var(--bg, rgba(0, 0, 0, 0.03));
      width: var(--w, min(500px, 90vw));
    }
    .options * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .options > * {
      grid-column: 2/-2;
    }
    .options > span {
      background: var(--bg-option, rgba(0, 0, 0, 0.05));
      color: var(--clr-option, rgb(0, 0, 0));
      padding: var(--pblock, 1rem) 1rem;
      border-radius: var(--br, 0.5vmax);
      transition: 0.05s ease;
      font-size: 1em;
      cursor: pointer;
    }
    .options > span:hover {
      background: var(--bg-option-h, rgba(0, 0, 0, 0.1));
      color: var(--clr-option-h, rgb(0, 0, 0));
    }
    .options > span.on {
      background: var(--bg-option-on, rgba(0, 0, 0, 0.788));
      color: var(--clr-option-on, rgb(245, 240, 240));
    }
    `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-options': QuizOptions
   }
}
