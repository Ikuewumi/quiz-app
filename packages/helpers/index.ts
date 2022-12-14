
export const sleep = (ms = 2000) => { return (new Promise(r => setTimeout(r, ms))) };



export const str = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (typeof arg === 'string')
   }, true) as boolean
}


export const num = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (typeof arg === 'number')
   }, true) as boolean
}


export const arr = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (Array.isArray(arg))
   }, true) as boolean
}


export const arrStr = (...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (arg.reduce(str))
   }, true)
}

export const arrFunc = (func: Function, ...args: any[]) => {
   return args.reduce((acc, arg) => {
      return acc && (arg.reduce(func))
   }, true)
}



