import { ReactiveVariable } from "vue/macros";
import { QuizTypes } from "types";
import { useToast } from ".";
import { fileToDataUrl } from "./img";
import { StoreTypings } from "../pinia/quizMetadata";
import { Store } from "pinia";


export class QuizMetadataLogic {
   constructor(
      public editImgBtn: ReactiveVariable<HTMLButtonElement>,
      public hiddenImgInput: ReactiveVariable<HTMLInputElement>,
      public titleInput: ReactiveVariable<HTMLInputElement>,
      public descriptionInput: ReactiveVariable<HTMLTextAreaElement>,
      public tagsInput: ReactiveVariable<HTMLInputElement>,
      public store: PiniaStores["creation"],
      public data?: QuizTypes.QuizMetadata,
      public config = {
         imgLimit: 100
      },
   ) { }


   fillFields() {
      this.titleInput.value = this?.store?.quizMetadata.title ?? ''
      this.descriptionInput.value = this?.store?.quizMetadata.description ?? ''
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
         this.fillSomeFields()
         this.store.quizMetadata.image = string
         return string

      } catch (e) {
         this.showMsg(e)
         throw Error(e as string)
      }
   }

   checkTagInput() {
      const isValid = this.tagsInput.value.split(',') && this.tagsInput.value.includes(',')
      if (isValid) {
         const validTags = this.tagsInput.value.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '.' && tag > '').filter(tag => !this?.store?.quizMetadata.tags.includes(tag))
         this.tagsInput.value = ''
         this.fillSomeFields()
         this.store.quizMetadata.tags! = [...this?.store?.quizMetadata.tags!, ...validTags]
      }
   }

   fillSomeFields() {
      this.store.quizMetadata.title = this.titleInput.value.trim() ?? ''
      this.store.quizMetadata.description = this.descriptionInput.value.trim() ?? ''
   }

   async checkSubmit() {
      try {
         await this.checkIfFieldsAreValid()

         return {
            title: this.titleInput.value.trim(),
            description: this.descriptionInput.value.trim(),
            tags: this?.store?.quizMetadata.tags,
            image: this?.store?.quizMetadata.image
         } as QuizTypes.QuizMetadata

      }
      catch (e) {
         this.showMsg(e, true)
         throw Error(e as string)
      }
   }


   async checkIfFieldsAreValid() {
      const titleIsValid = this.titleInput.value.trim() > ''
      const descIsValid = this.descriptionInput.value.trim() > ''
      const descIsLong = this.descriptionInput.value.trim().length > 30
      const tagsIsValid = this?.store?.quizMetadata.tags.length > 0
      const imgIsValid = this?.store?.quizMetadata.image > ''
      const isValid = titleIsValid && descIsValid && descIsLong && tagsIsValid && imgIsValid
      let msg: string = ''
      let isErr: boolean = true

      if (!isValid) {
         isErr = true
         if (!titleIsValid) msg = 'A title must be present'
         else if (!descIsValid) msg = 'A description must be present'
         else if (!descIsLong) msg = 'Description must be up to 30 words'
         else if (!tagsIsValid) msg = 'tags must be added'
         else if (!imgIsValid) msg = 'An image must be present'

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


   removeTag(index: number) {
      this.store.quizMetadata.tags = this?.store?.quizMetadata.tags.filter((_, i) => index !== i)
   }


   removeImg() {
      this.store.quizMetadata.image = ''
   }


   showMsg(e: any, isErr = true) {
      const toast = useToast()
      const err = e.toString() === '[object Object]' ? 'An error occured! That\'s all we know' : e.toString()
      toast.el.show(err, isErr)
   }




}