import { LitElement, css, html } from "lit";
import { property, customElement } from "lit/decorators.js";


@customElement('dialog-component')
export class DialogComponent extends LitElement {
   @property()
   question?: string = 'Are you ready?'

   @property()
   answers = {
      y: 'Yes',
      n: 'No'
   }

   getBtns() {
      const btns = Array.from(this.shadowRoot?.querySelectorAll('button')!) as HTMLButtonElement[]
      return btns
   }

   removeListeners() {
      this.getBtns().map(btn => btn.removeEventListener('click', _ => { }))
   }
   addListeners() {
      this.getBtns().map(btn => btn.addEventListener('click', _ => {
         const isYes = btn.classList.contains('yes')
         const evt = new CustomEvent('dialogSubmit', {
            bubbles: true,
            detail: { result: isYes }
         })

         this.dispatchEvent(evt)
      }))
   }


   open() {
      const d = this.shadowRoot?.querySelector('.confirm')
      d?.classList.remove(...['off', 'on'])
      d?.classList.add('on')
   }
   close() {
      const d = this.shadowRoot?.querySelector('.confirm')
      d?.classList.remove(...['off', 'on'])
      d?.classList.add('off')
   }

   updated() {
      this.addListeners()
   }

   disconnectedCallback() {
      super.disconnectedCallback()
      this.removeListeners()
   }


   render() {
      return html`
         <div class="confirm on">
            <dialog open>
               <p>${this.question}</p>
               <span class="bar">
                  <button class="no">${this.answers.n}</button>
                  <button class="yes">${this.answers.y}</button>
                  <!-- ❌✅  -->
               </span>
            </dialog>
         </div>
      `
   }

   static styles = css`

   .confirm.on {
      --display: grid
   }

   .confirm.off {
      --display: none
   }
   
   .confirm {
      width: var(--w, 100vw);
      height: var(--h, 100vh);
      background: var(--bg, rgba(0, 0, 0, 0.01));
      position: relative;
      box-sizing: border-box;
      font-size: var(--size, 17px);
      font-family: var(--f, "Work Sans");
      line-height: var(--lh, 1);
      display: var(--display, none);
    }
    .confirm * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .confirm dialog {
      position: absolute;
      inset: var(--inset, 20px auto auto 50%);
      transform: var(--translate, translate(-50%, 0));
      width: var(--w-dialog, min(400px, 90vw));
      border: 0;
      padding-block: var(--pbl, 1.3ch);
      display: grid;
      grid-template-columns: minmax(var(--g-p, 0.4em), 1fr) minmax(0, var(--g-dialog, 90%)) minmax(var(--g-p, 0.4em), 1fr);
      gap: var(--g, 2ch 0);
      border-radius: var(--br, 0.2vmax);
      box-shadow: var(--shadow, 0 0 2px rgba(0, 0, 0, 0.1));
      background: var(--bg-dialog, #fff);
      border-top: var(--border-w, 2px) solid var(--border-clr, rgb(97, 124, 255));
    }
    .confirm dialog p {
      font-size: var(--size-p, 17px);
      font-family: var(--f-p, var(--f, "Work Sans"));
    }
    .confirm dialog > * {
      grid-column: 2/-2;
    }
    .confirm dialog > .bar {
      display: grid;
      grid-template-columns: var(--grid-bar, 4fr 6fr);
      gap: var(--g-bar, 0.7ch);
    }
    .confirm dialog button {
      font-size: var(--size-btn, 13px);
      font-family: var(--f-btn, var(--f, "Work Sans"));
      padding-block: var(--pbl-btn, 1.35ch);
      border: var(--border-btn, none);
      border-radius: var(--br-btn, 0.4vmax);
      transition: var(--transition-time, 0.2s);
      background: var(--bg-btn, rgba(0, 0, 0, 0.07));
      color: var(--clr-btn, #000);
      cursor: pointer;
    }
    .confirm dialog button.yes {
      background: var(--bg-btn-y, rgba(34, 105, 146, 0.64));
      outline: var(--outline-btn, 0.1px) solid var(--bg-btn-y, rgba(34, 105, 146, 0.514));
      color: var(--clr-btn-y, #fff);
    }
    .confirm dialog button.no {
      background: var(--bg-btn-n, rgba(34, 105, 146, 0.12));
      outline: var(--outline-btn, 0.1px) solid var(--bg-btn-n, rgba(34, 105, 146, 0.12));
      color: var(--clr-btn-n, #000);
    }
    .confirm dialog button:hover.yes {
      background: var(--bg-btn-y-h, rgba(34, 105, 146, 0.5));
      outline: var(--outline-btn, 0.1px) solid var(--bg-btn-y, rgba(34, 105, 146, 0.404));
      color: var(--clr-btn-y-h, #fff);
    }
    .confirm dialog button:hover.no {
      background: var(--bg-btn-n-h, rgba(34, 105, 146, 0.22));
      outline: var(--outline-btn, 0.1px) solid var(--bg-btn-n-h, rgba(34, 105, 146, 0.04));
      color: var(--clr-btn-n-h, #000);
    }
    .confirm dialog button:focus, .confirm dialog button:focus-within, .confirm dialog button:focus-visible {
      outline: var(--outline-btn, 0.1px) solid var(--outline-btn-clr, rgba(0, 0, 0, 0.01));
    }
   
   `


}


declare global {
   interface HTMLElementTagNameMap {
      'dialog-component': DialogComponent
   }
}