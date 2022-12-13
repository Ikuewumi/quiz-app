import { ReactiveVariable } from "vue/macros";
import { QuizTypes } from "types";
import { HintTags, useToast } from ".";
import { fileToDataUrl } from "./img";
import { StoreTypings } from "../pinia/quizMetadata";
import { Store } from "pinia";
import { Ref, ref } from "vue";


export class QuizMetadataLogic {

   constructor(
      public editImgBtn: HTMLButtonElement,
      public hiddenImgInput: HTMLInputElement,
      public titleInput: HTMLInputElement,
      public descriptionInput: HTMLTextAreaElement,
      public tagsInput: HTMLSelectElement,
      public showCorrectionInput: HTMLSelectElement,
      public store: PiniaStores["creation"],
      public data?: QuizTypes.QuizMetadata,
      public config = {
         imgLimit: 100
      },
   ) {
   }


   fillFields(data: QuizTypes.QuizMetadata) {

      this.titleInput.value = data.title ?? ''
      this.descriptionInput.value = data.description ?? ''
      this.tagsInput.value = data.tags[0] ?? HintTags[0]
      this.showCorrectionInput.value = (data?.showCorrection ? 'yes' : 'no')
   }

   init() {
      // this.fillFields()
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
         this.fillSomeFields()
         // this.customRef.value.image = string
         return string

      } catch (e) {
         this.showMsg(e)
         throw Error(e as string)
      }
   }


   fillSomeFields() {
      this.store.quizMetadata.title = this.titleInput.value.trim() ?? ''
      this.store.quizMetadata.description = this.descriptionInput.value.trim() ?? ''
      this.store.quizMetadata.tags = [this?.tagsInput.value]
      // this.store.quizMetadata.image = this.customRef.value.image

   }

   async checkSubmit(img: string) {
      try {
         await this.checkIfFieldsAreValid(img)

         return {
            title: this.titleInput.value.trim(),
            description: this.descriptionInput.value.trim(),
            tags: [this?.tagsInput.value],
            image: img,
            showCorrection: this.showCorrectionInput.value === 'yes'
         } as QuizTypes.QuizMetadata

      }
      catch (e) {
         this.showMsg(e, true)
         throw Error(e as string)
      }
   }


   async checkIfFieldsAreValid(img: string) {
      const titleIsValid = this.titleInput.value.trim() > ''
      const descIsValid = this.descriptionInput.value.trim() > ''
      const descIsLong = this.descriptionInput.value.trim().length > 30
      const tagsIsValid = this.tagsInput.value.trim() > ''
      const imgIsValid = img > ''
      const isValid = titleIsValid && descIsValid && descIsLong && tagsIsValid && imgIsValid
      let msg: string = ''
      let isErr: boolean = true

      if (!isValid) {
         isErr = true
         if (!titleIsValid) msg = 'A title must be present'
         else if (!descIsValid) msg = 'A description must be present'
         else if (!descIsLong) msg = 'Description must be up to 30 words'
         else if (!tagsIsValid) msg = 'tags must be added'
         else if (!imgIsValid) msg = 'an image must be present'

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