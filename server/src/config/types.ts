import { Request, Response, NextFunction, Handler } from "express"
import { DocumentTypes } from "types"

export namespace Et {
   export interface Req extends Request {
      userDoc?: DocumentTypes.User
   }
   export interface Res extends Response { }
   export interface Next extends NextFunction { }
   export interface H extends Handler { }
}
