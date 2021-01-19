/*
 *
 * Token put subhandler
 *
 */
//import from local modules
import _data from "../../data"

import { Handler } from "../"

const put: Handler = (data, callback) => {
  // extract payload from data
  const { payload } = data

  // if payload processed
  if (payload) {
    const id =
      typeof payload.id == "string" && payload.id.length == 20 ? payload.id : ""
    const extend = Boolean(payload.extend)

    // check valid payload
    if (id) {
      if (extend) {
        // read token by id
        _data.read("tokens", id, (err, tokenData) => {
          if (!err && tokenData) {
            // check token not expired
            if ((tokenData.expires as number) > Date.now()) {
              tokenData.expires = Date.now() + 1000 * 60 * 60

              // update token
              _data.update(
                "tokens",
                id,
                (err) => {
                  if (!err) {
                    callback(200, tokenData)
                  } else {
                    callback(500, { Error: "Error updating token" })
                  }
                },
                tokenData
              )
            } else {
              callback(400, { Error: "Token already expired" })
            }
          } else {
            callback(400, { Error: "Invalid token" })
          }
        })
      } else {
        callback(400, { Error: "Missing required fields" })
      }
    } else {
      callback(400, { Error: "Invalid token" })
    }
  } else {
    callback("Please check your payload format")
  }
}

export default put
