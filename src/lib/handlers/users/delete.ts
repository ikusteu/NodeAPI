/*
 *
 * Users delete subhandler
 *
 */
// import from local modules
import _data from "../../data"
import helpers from "../../helpers"

// import from local types
import { Handler } from "../"

const del: Handler = ({ queryStringObject, headers }, callback) => {
  // check phone number
  const phone =
    typeof queryStringObject != "string" &&
    typeof queryStringObject.phone == "string" &&
    queryStringObject.phone.trim().length == 10
      ? queryStringObject.phone
      : ""
  // check token
  const token = typeof headers.token == "string" ? headers.token : ""

  // if phone number, delete user
  if (phone) {
    // check token provided
    if (token) {
      // authenticate
      helpers.verifyToken(phone, token, (success) => {
        if (success) {
          _data.delete("users", phone, (err) => {
            if (!err) {
              callback(204)
            } else {
              callback(400, { Error: "User not found" })
            }
          })
        } else {
          callback(403, {
            Error: "You don't have the permissions to access that user",
          })
        }
      })
    } else {
      callback(403, { Error: "Missing token in header" })
    }
  } else {
    // if phone not found
    callback(400, { Error: "Please provide a valid phone number" })
  }
}

export default del
