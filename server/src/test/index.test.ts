import { describe, expect, it } from "vitest"
import jwt from "jsonwebtoken"
import { sleep } from "helpers"
import bcrypt from "bcrypt"
import { AuthTypes } from "types"

describe('hello!', () => {
   it('should work', () => {
      expect(Math.sqrt(4)).toBe(2)
   })
})