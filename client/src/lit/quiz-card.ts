import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
function isString(val: any) {
   const r = Array.isArray(val) ? val.reduce((acc, curr) => acc && typeof curr === 'string', true) : typeof val === 'string'

   return r as boolean
}

interface Metadata {

   title: string;
   author: string;
   description: string;
   tags: string[];
   qid: string;
}

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('quiz-card')
export class QuizCard extends LitElement {
   /**
    * Copy for the read the docs hint.
    */
   @property()
   docsHint = 'Click on the Vite and Lit logos to learn more'

   @property({
      attribute: false,
      hasChanged: (newVal: Metadata) => {
         const r = isString([
            newVal.title,
            newVal.author,
            newVal.description,
            newVal.qid,
            ...newVal.tags
         ])

         return r
      }
   })
   quizMetadata?: Metadata = {
      title: "Dummmy Name",
      author: "A.B. Heuer",
      description: "description",
      tags: ['new', 'world', 'of', 'tags'],
      qid: 'qwsjhndivshjadiosc2edwqua8sdfi9'
   }

   /**
    * The number of times the button has been clicked.
    */
   @property({ type: Number })
   count = 0

   render() {
      return html`
         <div class="card" aria-labelledby="section">
            <header>
               <h1>${this.quizMetadata?.title}</h1>
               <small>By ${this.quizMetadata?.author}</small>
            </header>

            <main>
               <p>${this.quizMetadata?.description}</p>

               <div class="tags">
                  ${this.quizMetadata?.tags.map(tag => html`<span class = "tag">${tag}</span>`)}
               </div>
            </main>

            <span class="bookmark" role="button">
               <svg class="off" viewBox="0 0 16 16">
                  <path d="M4.5 2C3.675781 2 3 2.675781 3 3.5L3 14.484375L8 10.820313L13 14.484375L13 3.5C13 2.675781 12.324219 2 11.5 2 Z M 4.5 3L11.5 3C11.78125 3 12 3.21875 12 3.5L12 12.515625L8 9.578125L4 12.515625L4 3.5C4 3.21875 4.21875 3 4.5 3Z" />
               </svg>

               <svg class="on" viewBox="0 0 16 16">
                  <path d="M13 14.488281L8 10.820313L3 14.488281L3 3.5C3 2.671875 3.671875 2 4.5 2L11.5 2C12.328125 2 13 2.671875 13 3.5Z"  />
               </svg>
            </span>
         </div>
      `
   }


   static styles = css`
   .card {
      width: var(--w, min(500px, 90vw));
      background-color: var(--bg, rgba(199, 199, 199, 0.067));
      border: var(--border-width, 0.4px) solid var(--border, rgba(0, 0, 0, 0.3));
      font-family: var(--f-family, "Work Sans");
      font-size: var(--f-base-size, 14px);
      display: flow-root;
      display: grid;
      grid-template-columns: minmax(0.3rem, 1fr) minmax(0, 60ch) minmax(0.3rem, 1fr);
      column-gap: 1em;
      row-gap: 0.5em;
      padding-block: var(--pbl, clamp(0.5rem, 5% + 1rem, 2vw));
      padding-block-end: var(--pbl-end, clamp(0.6rem, 5% + 1.2rem, 2.3vw));
      transition: 0.2s;
      position: relative;
      border-radius: 0.9vmax;
    }
    .card * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .card > * {
      grid-column: 2/-2;
    }
    .card header {
      display: grid;
      gap: 0.5em;
    }
    .card header h1 {
      font-family: var(--f-h1, var(--f-family, "Urbanist"));
    }
    .card header small {
      font-size: 1em;
      font-family: var(--f-author, var(--f-family, "Overpass Mono"));
      font-weight: 700;
      color: var(--c-author, var(--c, #888));
    }
    .card main {
      display: grid;
      gap: 1em;
    }
    .card main > p {
      line-height: var(--lh, 1.4);
    }
    .card main div.tags {
      display: var(--showTags, grid);
      gap: 0.6em;
      grid-template-columns: repeat(auto-fit, minmax(20px, auto));
      justify-content: start;
    }
    .card main div.tags > span {
      background: var(--bg-tag, hsla(0deg, 4%, 80%, 0.212));
      padding: 0.6em 1.6em;
      border-radius: var(--br-tag, 0.4vmax);
      font-size: 0.8em;
      line-height: 1;
      color: var(--c-tag, var(--c, #777));
      transition: 0.2s ease;
      cursor: pointer;
    }
    .card main div.tags > span:hover {
      background: var(--bg-tag-h, hsla(0deg, 2%, 27%, 0.451));
      color: var(--c-tag-h, var(--c, #fff));
    }
    .card > .bookmark {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(20%, -6%);
      padding: 0.4rem;
      width: 40px;
      background: var(--bg-bkmk, rgba(0, 0, 0, 0.0666666667));
      border-bottom-left-radius: var(--br-bkmk, 0.3vmax);
      border-bottom-right-radius: var(--br-bkmk, 0.3vmax);
      cursor: pointer;
      --off: inline;
      --on: none;
      display: var(--showBkMk, inline);
    }
    .card > .bookmark.on {
      --off: none;
      --on: inline;
    }
    .card > .bookmark svg {
      max-width: 100%;
      fill: var(--f-bkmk, #535353);
    }
    .card > .bookmark svg.on {
      display: var(--on);
    }
    .card > .bookmark svg.off {
      display: var(--off);
    }
    .card > .bookmark:hover svg.off {
      fill: var(--f-bkmk-h, #979523);
    }
   `
}

declare global {
   interface HTMLElementTagNameMap {
      'quiz-card': QuizCard
   }
}
