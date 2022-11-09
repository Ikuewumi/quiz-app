import auth from "./auth/index"
import { Router, Response } from "express"
import { Et } from "../config/types"

const r = Router()

r.use('/auth', auth)

export default r