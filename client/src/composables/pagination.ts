import { ApiTypes } from "types";
import { ref, computed } from "vue"
import { createToastPromise } from ".";
import { apiGet } from "./auth";


export function paginate(link: string, limit: number = 20, auth: boolean = false) {

   return ref({

      state: {
         count: 0,
         page: 1,
         maxPageCount: 0,
         pageCount: 0,
         data: [] as any[]
      },


      async apiFetch(): Promise<ApiTypes.PaginatedData<any>> {
         const result = await apiGet(`${link}page=${this.state.page}`, auth)
         return result
      },

      addToState(result: ApiTypes.PaginatedData<any>) {
         this.state.data = [...this.state.data, ...result.data]
         this.state.count = result.count
         this.state.maxPageCount = result.maxPageCount
         this.state.page = result.page
         this.state.pageCount = result.pageCount
      },

      async start() {
         const result = await this.apiFetch()
         this.addToState(result)
      },


      get computedShouldShowMore() {
         return computed(() => {
            return this.state.count > (this.state.pageCount * this.state.page)
         })
      },

      get computedText() {
         const sM = this.computedShouldShowMore


         return computed(() => {
            const currentlyShowing = ((this.state.page - 1) * Math.floor(this.state.count / this.state.page)) + (this.state.pageCount)
            const text = sM ? `Showing ${currentlyShowing} of ${this.state.count} items` : `Showing all ${currentlyShowing} of ${this.state.count} items`
            return text
         })


      },


      async nextPage() {
         const isValid = this.computedShouldShowMore.value
         if (!isValid) return;
         this.state.page += 1
         const result = await this.apiFetch()
         this.addToState(result)
      },





      async promiseNextPage() {
         createToastPromise(this.nextPage, 'Loading more items', true)()
      }


   })


}