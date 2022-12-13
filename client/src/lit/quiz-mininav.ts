import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('quiz-mininav')
export class QuizMiniNav extends LitElement {

   connectedCallback(): void {
      super.connectedCallback()
   }

   disconnectedCallback(): void {
      super.disconnectedCallback()
      const spans = Array.from(this.shadowRoot?.querySelectorAll('span.btn')!) as HTMLSpanElement[]
      spans.forEach(span => {
         span.removeEventListener('click', _ => { })
      })
   }

   updated() {
      const spans = Array.from(this.shadowRoot?.querySelectorAll('span.btn')!) as HTMLSpanElement[]
      spans.forEach(span => {
         span.addEventListener('click', _ => {
            const isPrev = span.classList.contains('prev')

            this.dispatchEvent(new CustomEvent('miniNavClick', {
               detail: { toPrev: isPrev },
               bubbles: true
            }))

         })
      })

      const submitBtn = this.shadowRoot?.querySelector('button')! as HTMLButtonElement
      submitBtn.addEventListener('click', _ => {
         this.dispatchEvent(new CustomEvent('miniNavSubmit', { bubbles: true }))
      })
   }


   render() {
      return html`
         <section>
            <div class="content">
               <span class="btn prev" role="button">Previous</span>
               <span class="btn next" role="button">Next</span>
            </div>
            <div class="s">
               <button role="button">Submit</button>
               
            </div>
         </section>
      `
   }


   static styles = css`
   section {

      padding-block: var(--pbl, 0.8rem);
      row-gap: var(--row-g, 1.5rem);
      display: grid;
      grid-template-columns: minmax(var(--gp, 1.7em), 1fr) minmax(0, var(--w-c, 800px)) minmax(var(--gp, 1.7em), 1fr);
   }

   section > * {
      grid-column: 2 / -2;
   }

   .content {

      justify-content: space-between;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

   }

   .s {

      justify-content: center;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

   }

   .btn {
      display: flow-root;
      font-family: var(--fmly, "Urbanist");
      font-weight: var(--weight, 200);
      padding: 0.4em 1em;
      background: var(--bg, rgba(0, 0, 0, 0.03));
      border-radius: var(--br, 2vmax);
      border: 0;
      outline: 0.2px solid var(--out, rgba(0, 0, 0, 0.13));
      transition: 0.2s ease;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      max-width: var(--w, fit-content)
    }
    
    button {
      display: flow-root;
      font-family: var(--fmly, "Urbanist");
      font-weight: var(--weight, 200);
      padding: 0.4em 1em;
      background: var(--bg-btn, rgba(0, 0, 0, 0.03));
      border-radius: var(--br, 2vmax);
      border: 0;
      outline: 0.2px solid var(--out, rgba(0, 0, 0, 0.13));
      transition: 0.2s ease;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      max-width: var(--w, fit-content);
      font-size: var(--size-btn, clamp(15px, 15px + 0.9vw, 2.5ch));
   }

    button:hover {
      background: var(--bg-btn-h, rgba(0, 0, 0, 0.13));
    }
    button * {
      line-height: var(--lh-btn, 0.8);
    }
    .btn {
      font-size: var(--size, clamp(15px, 15px + 0.9vw, 2ch));
    }
    .btn:hover {
      background: var(--bg-h, rgba(0, 0, 0, 0.13));
    }
    .btn * {
      line-height: var(--lh, 0.8);
    }
    .btn * {
      margin: 0;
      padding: 0;
    }
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-mininav': QuizMiniNav
   }
}
