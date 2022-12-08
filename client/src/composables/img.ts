export const fileToDataUrl = (file: File): Promise<string> => {
   const p = new Promise((resolve, reject) => {

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onerror = () => {
         reject('something went wrong')
      }

      reader.onloadend = (result) => {
         resolve(reader.result as string)
      }

   })

   return p as Promise<string>

}