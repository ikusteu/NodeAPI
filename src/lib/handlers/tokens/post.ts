/*
 *
 * Token post subhandler
 *
 */
// import from local modules
import helpers from "../../helpers"
import _data from "../../data"

// import from local types
import { Handler } from "../"

const post: Handler = (data, callback) => {
  // extract payload from data
  const { payload } = data

  // if payload processed
  if (payload) {
    const { phone, password } = helpers.checkAndSanitize(payload)

    // read user data
    _data.read("users", phone, (err, data) => {
      if (!err && data) {
        // hash sent password password
        const hashedPassword = helpers.hash(password)
        // check password match
        if (data.hashedPassword == hashedPassword) {
          // if valid create new token, set expiration date 1h in the future
          const id = helpers.createRandomString(20)
          const expires = Date.now() + 1000 * 60 * 60
          const tokenObject = {
            phone,
            id,
            expires,
          }

          // persist tokenObject
          _data.create(
            "tokens",
            id,
            (err) => {
              if (!err) {
                callback(200, tokenObject)
              } else {
                callback(500, { Error: "Error writing to database" })
              }
            },
            tokenObject
          )
        } else {
          callback(400, { Error: "Wrong password" })
        }
      } else {
        callback(400, { Errpr: "Could not find specified user" })
      }
    })
  } else {
    callback(400, { Error: "Please check your payload format" })
  }
}

export default post
