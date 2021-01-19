/*
 *
 * Users post subhandler
 *
 */
// import from local modules
import _data from "../../data"
import helpers from "../../helpers"

// import from local types
import { Handler } from "../"

const post: Handler = (data, callback) => {
  // extract payload from data
  const { payload } = data

  // if payload processed
  if (payload) {
    const {
      firstName,
      lastName,
      phone,
      password,
      tosAgreement,
    } = helpers.checkAndSanitize(payload)

    if (firstName && lastName && phone && password && tosAgreement) {
      // make sure that user doesn't exist
      _data.read("users", phone, (err) => {
        // if read not successful, user doesn't exist, else callback 400
        if (err) {
          // hash password for storage
          const hashedPassword = helpers.hash(password)
          if (hashedPassword) {
            // create user object to be saved to "database"
            const userObject = {
              firstName,
              lastName,
              phone,
              hashedPassword,
              tosAgreement: true,
            }
            // save user object to "database"
            _data.create(
              "users",
              phone,
              (err) => {
                if (!err) {
                  callback(201, userObject)
                } else {
                  callback(500, { Error: "Error writing to database" })
                }
              },
              userObject
            )
          }
        } else {
          callback(400, { Error: "User already exists" })
        }
      })
    } else {
      callback(400, { Error: "Missing required fields" })
    }
  } else {
    callback(400, { Error: "Please check you payload format" })
  }
}

export default post
