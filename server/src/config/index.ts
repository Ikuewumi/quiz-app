import config from "config"
import { Et } from "./types"

/**Custom Express Functions */
export namespace Ef {
   export const msg = (res: Et.Res, message: any, status = 200) => res.status(status).json({ message: String(message) })
   export const obj = (res: Et.Res, object: { [index: string]: any }, status = 200) => res.status(status).json(object)
}