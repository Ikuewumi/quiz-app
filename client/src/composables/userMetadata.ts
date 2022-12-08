import { useToast } from "./index";
import { fileToDataUrl } from "./img";





declare global {

   interface InputMetadata {
      name: string,
      description: string,
      image: string
   }

}



export class UserMetadataLogic {
   constructor(
      public hiddenImgInput: HTMLInputElement,
      public nameInput: HTMLInputElement,
      public descriptionInput: HTMLTextAreaElement,
      public data?: InputMetadata,
      public config = {
         imgLimit: 100
      },
   ) { }


   fillFields() {
      this.nameInput.value = this?.data?.name ?? ''
      this.descriptionInput.value = this?.data?.description ?? ''

   }

   init() {
      this.fillFields()
      return this
   }

   showFilePicker() {
      this.hiddenImgInput.click()
   }

   async showImg() {
      try {

         if (!this.hiddenImgInput.files) throw Error('no file present!')
         const file = this.hiddenImgInput.files[0]
         if (!file) throw Error('no file present!')
         const imgIsValid = file.size <= (this.config.imgLimit * 1000)
         if (!imgIsValid) throw Error(`This image is too large. Images must be less than ${this.config.imgLimit}kb`)

         const string = await fileToDataUrl(file)
         return string

      } catch (e) {
         this.showMsg(e)
         throw Error(e as string)
      }
   }


   async checkSubmit(image: string) {
      try {
         await this.checkIfFieldsAreValid()

         return {
            name: this.nameInput.value.trim(),
            description: this.descriptionInput.value.trim(),
            image
         } as InputMetadata

      }
      catch (e) {
         this.showMsg(e, true)
         throw Error(e as string)
      }
   }


   async checkIfFieldsAreValid() {
      const nameIsValid = this.nameInput.value.trim() > ''
      const descIsValid = this.descriptionInput.value.trim() > ''
      const descIsLong = this.descriptionInput.value.trim().length > 30
      const d = descIsValid ? descIsLong : true
      const isValid = nameIsValid && d
      let msg: string = ''
      let isErr: boolean = true

      if (!isValid) {
         isErr = true
         if (!nameIsValid) msg = 'A name must be present'
         else if (!d) msg = 'Description must be up to 30 words'

         throw Error(msg)
      } else {
         isErr = false
         msg = "Valid Submit"
         this.showMsg(msg, false)
         return {
            isValid
         }
      }
   }



   showMsg(e: any, isErr = true) {
      const toast = useToast()
      const err = e.toString() === '[object Object]' ? 'An error occured! That\'s all we know' : e.toString()
      toast.el.show(err, isErr)
   }




}