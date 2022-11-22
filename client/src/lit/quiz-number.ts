import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'


@customElement('quiz-number')
export class QuizNumber extends LitElement {
   @property()
   numbers?: number = 40

   @state()
   _num?: number = 1


   tab(x: number) {
      const isValid = (this.numbers! >= x)

      if (!isValid) throw Error('the numbers')

      this._num = x
   }

   render() {
      return html`
         <div class="numbers" role="log">
            <span class="q">Q</span><span class="x">${this._num}</span> of <span class="y">${this.numbers}</span>
         </div>
      `
   }


   static styles = css`
   .numbers {
      display: flow-root;
      font-family: var(--fmly, "Urbanist");
      font-size: var(--size, clamp(1.4rem, 1.5rem + 0.9vw, 4vw));
      font-weight: var(--weight, 200);
      padding: 0.4em 1em;
      background: var(--bg, rgba(0, 0, 0, 0.03));
      border-radius: var(--br, 2vmax);
      outline: 0.2px solid var(--out, rgba(0, 0, 0, 0.13));
      transition: 0.2s ease;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      max-width: var(--w, fit-content)
    }
    .numbers:hover {
      background: var(--bg, rgba(0, 0, 0, 0.13));
    }
    .numbers * {
      line-height: var(--lh, 0.8);
    }
    .numbers span.q {
      font-size: 1.4em;
      font-weight: var(--weight-h1, 500);
    }
    .numbers * {
      margin: 0;
      padding: 0;
    }
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-number': QuizNumber
   }
}
