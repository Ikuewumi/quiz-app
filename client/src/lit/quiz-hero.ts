import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('quiz-hero')
export class QuizHero extends LitElement {

   @property()
   header?: string = 'Hey!, Wanna test your skills?'

   @property()
   about?: string = 'How about this quiz app to sheck your skills and see for your self'

   @property()
   link?: string = '#'


   render() {
      return html`
         <section class="hero">
            <header>
               <h1>${this.header}</h1>
               <p>${this.about}</p>
            </header>
            <article>
               <a role="button" href="${this.link}">Get Started!</a>
            </article>
         </section>
      `
   }


   static styles = css`
   
   .hero {
      width: var(--w, 100vw);
      background-color: var(--bg, rgba(199, 199, 199, 0.0666666667));
      background-image: var(--bg-img, none);
      background-size: cover;
      background-repeat: no-repeat;
      border: var(--border-width, 0.4px) solid var(--border, rgba(0, 0, 0, 0.3));
      font-family: var(--f-family, "Work Sans");
      font-size: var(--size, 14px);
      display: flow-root;
      display: grid;
      grid-template-columns: minmax(2em, 1fr) minmax(0, var(--w-content, 60ch)) minmax(2em, 1fr);
      place-items: center;
      align-content: center;
      column-gap: 0em;
      row-gap: var(--g, 2.6em);
      padding-block: var(--pbl, clamp(0.5rem, 5% + 1rem, 2vw));
      color: var(--clr, #000);
      text-align: center;
      min-height: var(--h, 500px);
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
    .hero article a {
      padding: var(--pin-btn, 0.8em) var(--pbl-btn, 1.6em);
      font-family: var(--f-btn, var(--f-h1, var(--f-family, "Urbanist")));
      font-weight: var(--weight-btn, 600);
      font-size: var(--f-about, clamp(0.8em, 0.8em + 1vw, 1.1em));
      background: var(--bg-btn, rgba(0, 0, 0, 0.04));
      color: var(--clr-btn, var(--clr, #000));
      border: var(--border-width-btn, 0.4px) solid var(--border-btn, rgba(0, 0, 0, 0.3));
      text-decoration: var(--text-decoration-btn, none);
      border-radius: var(--br, 0.4vmax);
      cursor: pointer;
      transition: 0.2s;
    }
    .hero article a:hover {
      background: var(--bg-btn, rgba(0, 0, 0, 0.6));
      color: var(--clr-btn, var(--clr, #ffe));
    }
   
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-hero': QuizHero
   }
}
