import { AuthTypes } from "types"
import { apiPost } from "./auth"

// export const api = 'http://localhost:5000'
export const api = window.location.origin.startsWith('http://localhost:') ? 'http://localhost:5000' : window.location.origin



export const tokenName = 'quizAppIkAccess'
const refreshToken = 'quizAppIkRefresh'
const accessExpiryDate = 'quizAppIkAccessExpiryToken'



export function clearTokens() {
   setToken('')
   setRefreshToken('')
}


export async function getToken() {
   let exp: string | number | null = getAccessExpiryDate()
   if (!exp) throw Error('something got mixed up!. please log in again')
   exp = Number(exp)


   const isExpired = Date.now() > exp
   if (!isExpired) {
      const x = localStorage.getItem(tokenName)
      if (x && typeof x === 'string' && x > '') return x
      else throw Error('something got mixed up!. please log in again')
   } else {


      const refresh = await getRefreshToken()
      const newTokens = await apiPost('auth/authorize', { refreshToken: refresh }, false) as AuthTypes.Tokens
      setToken(newTokens?.accessToken ?? '')
      setRefreshToken(newTokens?.refreshToken ?? '')
      setAccessExpiryDate()


      return newTokens.accessToken




   }
}

export function setToken(token: string = '') {
   return localStorage.setItem(tokenName, token)
}

export async function getRefreshToken() {
   const x = localStorage.getItem(refreshToken)
   if (x && typeof x === 'string' && x > '') return x
   else return Promise.reject('no token present')
}

export function setRefreshToken(token: string = '') {
   return localStorage.setItem(refreshToken, token)
}

export function getAccessExpiryDate() {
   return localStorage.getItem(accessExpiryDate)
}



export function setAccessExpiryDate() {
   const newDate = (Date.now() + (14.5 * 60 * 1000))
   return localStorage.setItem(accessExpiryDate, `${newDate}`)
}



export const regexObject = {
   name: /^([a-zA-Z]+) ([a-zA-Z]+)$/,
   password: /^[\w\W]{6,}$/,
   email: /^([a-z\d\.]+)@([a-z\d\-]+)\.([a-z]{2,8})((\.)[a-z]{2,8})?$/,
   imdbId: /^tt[0-9]{6,12}$/,
   dbid: /^(\w\d){24}$/
} as { [index: string]: RegExp }



export const validateRegex = async (name: string, testString: string, errorMsg?: string) => {

   const isInObject = name in regexObject
   if (!isInObject) throw Error('sorry! there\'s no regex matching this name')


   const isValid = regexObject[name].test(testString)
   if (!isValid) throw Error(errorMsg ?? 'oops! input does not match the specified pattern')


   return testString



}