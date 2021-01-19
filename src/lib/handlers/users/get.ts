/*
 *
 * Users get subhandler
 *
 */
// import from local modules
import _data from "../../data"
import helpers from "../../helpers"

// import from local types
import { Handler } from "../"

const get: Handler = ({ queryStringObject, headers }, callback) => {
  // check phone number
  const phone =
    typeof queryStringObject != "string" &&
    typeof queryStringObject.phone == "string" &&
    queryStringObject.phone.trim().length == 10
      ? queryStringObject.phone
      : ""

  const token = headers.token

  // check phone provided
  if (phone) {
    // check token
    if (typeof token === "string") {
      // verify token matches user
      helpers.verifyToken(phone, token, (success) => {
        if (success) {
          // if token valid and matches read user
          _data.read("users", phone, (err, data) => {
            if (!err && data) {
              delete data.hashedPassword
              callback(200, data)
            } else {
              callback(404, { Error: "User not found" })
            }
          })
        } else {
          callback(403, {
            Error: "You don't have the permissions to access the given user",
          })
        }
      })
    } else {
      callback(403, {
        Error: "You don't have the permissions to access the given user",
      })
    }
  } else {
    // if phone not found
    callback(400, { Error: "Please provide a valid phone number" })
  }
}

export default get
