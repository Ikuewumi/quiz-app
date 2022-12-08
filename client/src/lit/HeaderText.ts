import { LitElement, html, css } from "lit"
import { customElement, property } from "lit/decorators.js"


@customElement('header-text')
export class H1Component extends LitElement {
   @property()
   content = 'a button'

   render() {
      return html`
         <h1>${this.content}</h1>
      `
   }

   static styles = css`
      :host {
         width: var(--w, fit-content);
         height: var(--h, fit-content);
      }

      h1 {
         padding: var(--pin, 0.1em) var(--pbl, 0.2em);
         font-family: var(--f-btn, var(--f-h1, var(--f-family, "Urbanist")));
         font-weight: var(--weight-btn, 600);
         font-size: var(--f-fmly, clamp(0.8em, 0.8em + 1vw, 1.1em));
         line-height: var(--lh, 1);
         background: var(--bg, transparent);
         color: var(--clr, #000);
         border: var(--border-width-btn, 0px) solid var(--border-btn, rgba(0, 0, 0, 0.3));
         text-decoration: var(--text-decoration-btn, none);
         border-radius: var(--br, 0.4vmax);
         cursor: pointer;
         transition: 0.2s;
         width: var(--w, fit-content);
         height: var(--h, fit-content);
      }
      h1:hover {
         background: var(--bg-h, transparent);
         color: var(--clr-h, var(--clr, #000));
      }


      * {
         margin: 0;
         padding: 0;
         box-sizing: border-box;
      }
   `

}


declare global {
   interface HTMLElementTagNameMap {
      'header-text': H1Component
   }
}

