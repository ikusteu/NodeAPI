/*
 *
 * Users put subhandler
 *
 */
// import from local modules
import _data from "../../data"
import helpers from "../../helpers"

// import from local types
import { Handler } from "../"

const put: Handler = ({ payload, headers }, callback) => {
  // if payload processed
  if (payload) {
    const { firstName, lastName, password, phone } = helpers.checkAndSanitize(
      payload
    )
    // process token
    const token = typeof headers.token == "string" ? headers.token : ""
    // check phone
    if (phone) {
      // token valid
      if (token) {
        // authenticate
        helpers.verifyToken(phone, token, (success) => {
          if (success) {
            // update if at least one field is present in payload
            if (firstName || lastName || password) {
              // read old data entry and 404 if not found
              _data.read("users", phone, (err, data) => {
                // if found, update values locally
                if (!err && data) {
                  let updateData = data

                  if (firstName) {
                    updateData.firstName = firstName
                  }

                  if (lastName) {
                    updateData.lastName = lastName
                  }

                  if (password) {
                    updateData.password = helpers.safeParse(password)
                  }

                  // presist older copy updated with neccessary data
                  _data.update(
                    "users",
                    phone,
                    (err) => {
                      if (!err) {
                        const returnData = updateData
                        delete returnData.password
                        callback(200, returnData)
                      } else {
                        callback(500, { Error: "Error updating user" })
                      }
                    },
                    updateData
                  )
                } else {
                  callback(404, { Error: "User not found" })
                }
              })
            } else {
              callback(400, { Error: "Please enter a property to update" })
            }
          } else {
            callback(403, {
              Error: "You don't have the permissions to access user",
            })
          }
        })
      } else {
        callback(403, { Error: "Missing token from header" })
      }
    } else {
      callback(400, { Error: "Please provide a valid phone number" })
    }
  } else {
    callback(400, { Error: "Please check your payload format" })
  }
}

export default put
