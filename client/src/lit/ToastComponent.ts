import { LitElement, css, html } from "lit";
import { property, customElement, state } from "lit/decorators.js";


@customElement('toast-component')
export class ToastComponent extends LitElement {

   @property()
   msg?: string = 'A good world'

   @property()
   time?: number = 5000

   @state()
   _timeInterval = 0

   enterMsg(msg: string, isErr: boolean = true) {
      const toast = this.shadowRoot?.querySelector('div.toast')!
      if (isErr) toast.classList.add('err')
      else toast.classList.remove('err')
      this.msg = msg
   }

   protected _resetClasses() {
      const toast = this.shadowRoot?.querySelector('div.toast')!
      toast.classList.remove(...['on', 'off'])
      return toast
   }

   open() {
      const toast = this._resetClasses()
      toast.classList.add('on')
   }

   close() {
      const toast = this._resetClasses()
      toast.classList.add('off')
   }

   show(msg: string, isErr = false) {
      this.enterMsg(msg, isErr)
      this.open()
      clearTimeout(this._timeInterval)

      const p = new Promise((res) => {
         this._timeInterval = setTimeout(() => {
            this.close()
            res('done')
         }, this.time ?? 5000) as unknown as number
      })

      return p
   }



   render() {
      return html`
         <div class="toast">
            <span>${this.msg}</span>
         </div>
      `
   }

   static styles = css`
   
   .toast {
      box-sizing: border-box;
      position: var(--position, fixed);
      inset: var(--inset, auto auto 20px 50%);
      transform: var(--translate, translate(-50%, 150%));
      width: var(--w, min(400px, 80vw));
      border-radius: var(--br, 0.2vw);
      background: var(--bg, #222);
      line-height: var(--lh, 0.9);
      color: var(--clr, #fff);
      padding-block: var(--pbl, 1.7ch 2.4ch);
      font-family: var(--fmly, "Work Sans");
      font-size: var(--size, 14px);
      border-top: var(--border-w, 2px) solid var(--border-clr, rgb(97, 124, 255));
      display: grid;
      grid-template-columns: minmax(0.1em, 1fr) minmax(0, 90%) minmax(0.1em, 1fr);
      z-index: 8;
   }
   
   .toast.err {
       border-top: var(--border-w, 2px) solid var(--border-clr-err, #f47070 );
    }
    .toast * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .toast * {
      grid-column: 2/-2;
    }
    .toast.on {
      animation: off var(--anim-time, 0.5s) ease forwards;
    }
    .toast.off {
      animation: on var(--anim-time, 0.5s) ease forwards;
    }
    @keyframes off {
      from {
        transform: var(--translate-off, translate(-50%, 150%));
      }
      to {
        transform: var(--translate-on, translate(-50%, 0%));
      }
    }
    @keyframes on {
      from {
        transform: var(--translate-on, translate(-50%, 0%));
      }
      to {
        transform: var(--translate-off, translate(-50%, 150%));
      }
    }
   
   `;


}



declare global {
   interface HTMLElementTagNameMap {
      'toast-component': ToastComponent
   }
}
