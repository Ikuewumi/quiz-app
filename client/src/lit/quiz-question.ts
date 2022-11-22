import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('quiz-question')
export class QuizQuestion extends LitElement {
   @property()
   question = 'What country is Riyadh in?'

   render() {
      return html`
      <div class="question">
         <header>
            <h1>${this.question}</h1>
         </header>
         <article>
            <slot>
            </slot>
         </article>
      </div>
      `
   }

   static styles = css`
   .question {
      width: var(--w, min(500px, 70vw));
      font-size: var(--size, 12px);
      font-weight: var(--weight, 400);
      font-family: var(--fmly, "Work Sans");
      display: grid;
      grid-template-columns: minmax(var(--gp, 1.7em), 1fr) minmax(0, var(--w-c, 800px)) minmax(var(--gp, 1.7em), 1fr);
      padding-block: var(--pbl, var(--gp, 0.7em));
      row-gap: var(--gap, 2em);
      background: var(--bg, rgba(0, 0, 0, 0.03));
    }
    .question * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .question > * {
      grid-column: 2/-2;
    }
    .question img, .question svg, .question figure {
      max-width: var(--w-img, 100%);
    }
    .question header h1 {
      font-size: var(--size-h1, clamp(1.01em, 1.01em + 0.5vw, 2.1vw));
      font-family: var(--h1, var(--fmly, "Urbanist"));
      font-weight: var(--weight-h1, 400);
    }
    .question article {
      display: grid;
      gap: var(--gap-a, 1em);
      font-size: var(--size-about, 14px);
    }
    .question img, .question svg {
      outline: 2px solid #fff;
    }`
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-question': QuizQuestion
   }
}
