import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('quiz-hero')
export class QuizHero extends LitElement {

   @property()
   header?: string = 'Hey!, Wanna test your skills?'

   @property()
   about?: string = 'How about this quiz app to sheck your skills and see for your self'

   @property()
   link?: string = '#'


   @property()
   linkName?: string = 'Get Started'

   updated() {
      const a = this.shadowRoot?.querySelector('a')! as HTMLAnchorElement
      a.onclick = (e) => {
         e.preventDefault()
         const evt = new CustomEvent('btnClick', { bubbles: true })
         this.dispatchEvent(evt)
      }
   }

   disconnectedCallback() {
      super.disconnectedCallback()
      const a = this.shadowRoot?.querySelector('a')! as HTMLAnchorElement
      a.removeEventListener('click', _ => { })
   }


   render() {
      return html`
         <section class="hero">
            <header>
               <h1>${this.header}</h1>
               <p>${this.about}</p>
            </header>
               <a role="button" href="${this.link}">${this.linkName}</a>

         </section>
      `
   }


   static styles = css`
   
   .hero {
      width: var(--w, 100vw);
      background-color: var(--p-bg, rgba(199, 199, 199, 0.0666666667));
      background-image: var(--p-bg-img, none);
      background-size: cover;
      background-repeat: no-repeat;
      border: var(--border-width, 0.4px) solid var(--border, rgba(0, 0, 0, 0.3));
      border-radius: var(--border-radius, 0.3vmax);
      font-family: var(--f-family, "Work Sans");
      font-size: var(--size, 14px);
      display: flow-root;
      display: grid;
      grid-template-columns: minmax(2em, 1fr) minmax(0, var(--w-content, 60ch)) minmax(2em, 1fr);
      place-items: center;
      align-content: center;
      column-gap: 0em;
      row-gap: var(--p-g, 2.6em);
      padding-block: var(--p-pbl, clamp(0.5rem, 5% + 1rem, 2vw));
      color: var(--clr, #000);
      text-align: center;
      min-height: var(--h, 500px);
      box-sizing: border-box;
    }
    .hero * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .hero > * {
      grid-column: 2/-2;
    }
    .hero header {
      display: grid;
      place-items: center;
      gap: var(--g-header, 1.3em);
    }
    .hero header h1 {
      font-size: var(--size-h1, clamp(2em, 2em + 2vw, 6ch));
      font-family: var(--f-h1, "Urbanist");
      line-height: var(--lh-h1, 0.9);
      max-width: var(--w-h1, 15ch);
      color: var(--clr-h1, var(--clr, #000));
    }
    .hero header p {
      font-size: var(--f-about, clamp(0.8em, 0.8em + 1vw, 1em));
      line-height: var(--lh-about, 1.2);
      color: var(--clr-about, var(--clr, #000));
    }
    .hero a {
      padding: var(--pbl, 0.4em) var(--pin, 1.2em);
      font-family: var(--f, "Urbanist");
      font-weight: var(--weight, 600);
      font-size: var(--size, clamp(0.8em, 0.8em + 1vw, 1.1em));
      background: var(--bg, rgba(0, 0, 0, 0.02));
      color: var(--clr, var(--clr, #000));
      border: var(--border-w, 0.1px) solid var(--border-color, rgba(0, 0, 0, 0.2));
      text-decoration: var(--text-decoration, none);
      border-radius: var(--br, 0.4vmax);
      cursor: pointer;
      transition: var(--transition, 0.2s);
    }
    .hero a:hover {
      background: var(--bg-h, rgba(61, 126, 146, 0.6));
      color: var(--clr-h, var(--clr, #ffe));
    }
   
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-hero': QuizHero
   }
}
