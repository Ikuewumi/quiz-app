import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"


@customElement('button-component')
export class ButtonComponent extends LitElement {
   @property()
   content = 'a button'

   render() {
      return html`
         <button>
            ${this.content}
         </button>
      `
   }

   static styles = css`
      button {
         padding: var(--pbl, 0.4em) var(--pin, 1.2em);
         font-family: var(--f, "Urbanist");
         font-weight: var(--weight, 600);
         font-size: var(--size, clamp(0.8em, 0.8em + 1vw, 1.1em));
         background: var(--bg, rgba(0, 0, 0, 0.02));
         color: var(--clr, var(--clr, #000));
         border: var(--border-w, 0.1px) solid var(--border-color, rgba(0, 0, 0, 0.02));
         text-decoration: var(--text-decoration, none);
         border-radius: var(--br, 0.4vmax);
         cursor: pointer;
         transition: 0.2s;
      }
      button:hover {
         background: var(--bg-h, rgba(61, 126, 146, 0.6));
         color: var(--clr-h, var(--clr, #ffe));
      }

      button:focus {
         outline: var(--outline-w, 0.2px) solid var(--outline-clr, rgb(0 0 0 / 0.05))
      }
   `

}


declare global {
   interface HTMLElementTagNameMap {
      'button-component': ButtonComponent
   }
}

