import { useLoader } from "../pinia/loader"

export const useModal = () => {
   return {
      modal: document.querySelector('modal-component')!,
      open() { this.modal.show() },
      close() { this.modal.hide() }
   }
}

export const useToast = () => {
   return {
      el: document.querySelector('toast-component')!
   }
}



export function createToastPromise<T>(fn: (...args: any[]) => Promise<T>, msg: string = 'Loading', showLoader = true) {


   const p = async () => {
      try {
         if (showLoader) { useLoader().msg = msg ?? 'loading...' }
         const result = await fn()
         return result
      }
      catch (e) {
         useToast().el.show(String(e), true)
         throw Error(e as string)
      } finally {
         if (showLoader) {
            useLoader().msg = ''
            clearTimeout(useLoader().interval)
         }
      }
   }


   return p

}

export function createLoadingPromise<T>(msg: string, fn: (...args: any[]) => Promise<T>) {


   const p = async () => {
      try {
         useLoader().msg = msg ?? 'loading...'
         const result = await fn()
         return result
      }
      catch (e) {
         useToast().el.show(String(e), true)
         throw Error(e as string)
      }
      finally {
         useLoader().msg = ''
         clearTimeout(useLoader().interval)
      }
   }


   return p

}


export const sleep = async (ms = 200) => new Promise((res) => setTimeout(res, ms))

export const HintTags = [
   'medicine', 'zoology', 'botany',
   'engineering', 'arts', 'computing',
   'social-sciences', 'history',
   'geography', 'other'
]


export const title = (str: string) => { document.title = str }

