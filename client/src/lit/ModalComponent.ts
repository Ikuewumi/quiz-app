import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement } from "lit/decorators.js";


@customElement('modal-component')
export class ModalComponent extends LitElement {

   updated() {
      const section = this.shadowRoot?.querySelector('section.modal')! as HTMLDivElement
      section.onclick = (e) => {
         if (e.target === section) this.hide()
      }
   }

   show() {
      const section = this.shadowRoot?.querySelector('section.modal')!
      section.classList.add('on')
   }

   hide() {
      const section = this.shadowRoot?.querySelector('section.modal')!
      section.classList.remove('on')
   }


   render() {
      return html`
         <section class="modal">
            <div class="content">
               <slot></slot>
            </div>
         </section>
      `
   }

   static styles = css`

   :host .content {
      grid-column: 2 / -2;
      height: fit-content;
   }
   ::slotted(*) {
      // grid-column: 2 / -2;
      height: fit-content;
      
   }
   

   .modal {
      z-index: var(--z-max, 30);
      width: var(--w, 100vw);
      height: var(--h, 100vh);
      background: var(--bg, rgba(0, 0, 0, 0.01));
      position: fixed;
      inset: var(--inset, 0 auto auto 0);
      box-sizing: border-box;
      font-size: var(--size, 17px);
      font-family: var(--f, "Work Sans");
      line-height: var(--lh, 1);
      display: var(--modal-display, none);
    }

   .modal.on {
      --modal-display: grid;
   }
    .modal * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .modal .content {
      position: absolute;
      inset: var(--inset, 20px auto auto 50%);
      transform: var(--translate, translate(-50%, 0));
      width: var(--w-content, min(400px, 90vw));
      border: 0;
      padding-block: var(--pbl, 1.3ch);
      display: grid;
      grid-template-columns: minmax(var(--g-p, 0.4em), 1fr) minmax(0, var(--g-content, 90%)) minmax(var(--g-p, 0.4em), 1fr);
      gap: var(--g, 2ch 0);
      border-radius: var(--br, 0.2vmax);
      box-shadow: var(--shadow, 0 0 2px rgba(0, 0, 0, 0.1));
      background: var(--bg-dialog, #fff);
      border-top: var(--border-w, 2px) solid var(--border-clr, rgb(97, 124, 255));
      min-height: var(--h-content, 400px);
    }

    .modal .content > slot  {
      display: grid;
      gap: var(--g-slot, 0.4ch);
      align-items: var(--align-slot, center);
      height: var(--h-slot, fit-content);
      grid-column: 2 / -2;
    }
    .modal .content > * {
      grid-column: 2/-2;
    }`


}


declare global {
   interface HTMLElementTagNameMap {
      'modal-component': ModalComponent
   }
}