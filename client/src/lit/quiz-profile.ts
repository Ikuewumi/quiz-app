import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
function isString(val: any) {
   const r = Array.isArray(val) ? val.reduce((acc, curr) => acc && typeof curr === 'string', true) : typeof val === 'string'

   return r as boolean
}

interface Data {
   img: string;
   name: string;
   email: string;

}

const dummyPicture = html`
   <svg viewBox="0 0 128 128"><path fill="#fff" d="M87 59.7c0 12.7-10.3 23-23 23s-23-10.3-23-23V32.3l46 5.5V59.7zM101.1 115.6C93.7 102.7 79.9 94 64 94h0c-15.9 0-29.7 8.7-37.1 21.6L27 119h74L101.1 115.6z"/><path fill="#444b54" d="M26.9 118.6c-.5 0-1-.1-1.5-.4-1.4-.8-1.9-2.6-1.1-4.1C32.4 99.9 47.6 91 64 91s31.6 8.9 39.7 23.1c.8 1.4.3 3.3-1.1 4.1s-3.3.3-4.1-1.1C91.4 104.7 78.2 97 64 97c-14.2 0-27.4 7.7-34.5 20.1C29 118 28 118.6 26.9 118.6zM77.6 29.1l-.4-.6c-2.9-4.1-7.7-6.6-12.7-6.6H56c-12.7 0-23 10.3-23 23v0c0 1.7 1.3 3 3 3h5.2c.1 0 .1 0 .2 0 11.5 0 23.2 0 31.6-7.5v.1c.4-.4.8-.7 1.1-1.1 1.1-1.2 3-1.4 4.2-.3 1.3 1.1 1.4 3.1.2 4.4-.5.5-.9.9-1.4 1.4-1.3 1.3-.8 3.5.9 4.2l0 0c1 .4 2.1.6 3.2.7 1.5.2 2.7 1.4 2.7 3v6.8c0 10.6-8 19.7-18.6 20.4C53.8 80.8 44.1 71.6 44 60.1c0-1.6-1.2-3-2.8-3.1-1.7-.1-3.2 1.3-3.2 3 0 14.3 11.7 26 26 26 13.9 0 25.3-10.9 26-24.7 0-.1 0-.2 0-.3V47v-3-1C90 35.8 84.6 29.9 77.6 29.1z"/></svg>
`
const image = (url: string, author: string) => html`
   <img src="${url}" alt="${author}"/>
`

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('quiz-profile')
export class QuizProfile extends LitElement {

   @property({
      attribute: false,
      hasChanged(val: Data) {
         const r = isString([val.email, val.name, val.img])
         return r
      },
   })
   data?: Data = {
      img: '',
      name: 'Hans Sunderland',
      email: 'hanssland@gmail.com'
   }

   /**
    * The number of times the button has been clicked.
    */
   @property({ type: Number })
   count = 0

   render() {
      return html`
         <div class="dashboard" aria-labelledby="section">

            <div class="content" role="contentinfo">
               <figure role="img" aria-hidden>
                  ${this.data?.img! > '' ? image(this.data?.img!, this.data?.name!) : dummyPicture}
               </figure>
               
               <main>
                  <strong>${this.data?.name}</strong>
                  <span>${this.data?.email}</span>
               </main>
            </div>

         </div>
    `
   }

   static styles = css`
   .dashboard {
      width: var(--w, 300px);
      background-color: var(--bg, rgba(199, 199, 199, 0.0666666667));
      height: var(--h, 100vh);
      display: grid;
      align-items: center;
      justify-items: center;
      grid-template-columns: minmax(0.2rem, 1fr) minmax(0, auto) minmax(0.3rem, 1fr);
      column-gap: 1em;
      row-gap: var(--g, 1em);
      color: var(--c, #222);
      font-size: var(--size, 13px);
      font-family: var(--f, "Work Sans");
      text-align: center;
      word-wrap: break-word;
      border-right-width: var(--br-w, 0px);
      border-right-style: solid;
      border-image-source: var(--br-bg, linear-gradient(30deg, rgba(0, 0, 0, 0), rgb(255, 92, 92) 20%, rgb(135, 228, 135)));
      border-image-slice: 1;
    }
    .dashboard * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .dashboard .content {
      display: grid;
      place-items: center;
      height: auto;
      grid-column: 2/-2;
      gap: 1rem;
    }
    .dashboard figure {
      width: var(--w-img, 150px);
    }
    .dashboard img, .dashboard svg {
      max-width: 100%;
    }
    .dashboard main {
      display: grid;
      place-items: center;
      gap: var(--g-main, 1em);
    }
    .dashboard strong {
      font-family: var(--f-h1, var(--f-family, "Urbanist"));
      font-size: var(--size-h1, clamp(1.2em, 1.2em + 3vw, 2.5vw));
      line-height: var(--lh-h1, 0.9);
    }
    .dashboard span {
      font-family: var(--f-p, var(--f, "Work Sans"));
      font-size: var(--size-p, clamp(0.9rem, 1rem + 1.4vw, 1.2vw));
    }
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-profile': QuizProfile
   }
}
