/**
 *
 * Helpers for various tasks
 *
 */
// import from node modules
import crypto from "crypto"
import _data from "./data"
import { hashingSecret } from "./config"

// container for all helpers
const helpers = {
  // hash pasword using SHA265
  hash: (str: unknown) => {
    if (str && typeof str == "string") {
      const hash = crypto
        .createHmac("sha256", hashingSecret)
        .update(str)
        .digest("hex")
      return hash
    }
    return false
  },

  // safe parse
  safeParse: (str: string) => {
    try {
      return JSON.parse(str)
    } catch (err) {
      console.log(err)
      return false
    }
  },

  // check and sanitize payload for put and post
  checkAndSanitize: (payload: Record<string, unknown>) => {
    // init default return object (with empty values)
    let returnObject = {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      tosAgreement: false,
    }

    returnObject.firstName =
      typeof payload.firstName === "string" &&
      payload.firstName.trim().length > 0
        ? payload.firstName.trim()
        : ""

    // check and sanitize lastName
    returnObject.lastName =
      typeof payload.lastName === "string" && payload.lastName.trim().length > 0
        ? payload.lastName.trim()
        : ""

    // check and sanitize phone number
    returnObject.phone =
      typeof payload.phone == "string" && payload.phone.trim().length == 10
        ? payload.phone
        : ""

    // check and sanitize password
    returnObject.password =
      typeof payload.password == "string" && payload.password.trim().length
        ? payload.password
        : ""

    // check for tosAgreement
    returnObject.tosAgreement = Boolean(payload.tosAgreement)

    return returnObject
  },

  // create random string with defined length
  createRandomString: (length: number) => {
    if (length > 0) {
      const possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789"
      let str = ""
      for (let i = 0; i < length; i++) {
        str += possibleCharacters.charAt(
          Math.floor(Math.random() * possibleCharacters.length)
        )
      }
      return str
    } else {
      return ""
    }
  },

  // verify user token exists and is valid for this user
  verifyToken: (phone: string, id: string, callback: (a: boolean) => void) => {
    // find token
    _data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        if (
          (tokenData.expires as number) > Date.now() &&
          tokenData.phone == phone
        ) {
          callback(true)
        } else {
          callback(false)
        }
      } else {
        callback(false)
      }
    })
  },
}

export default helpers
