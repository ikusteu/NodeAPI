/*
 *
 * Token get subhandler
 *
 */
//import from local modules
import _data from "../../data"

import { Handler } from "../"

const get: Handler = (data, callback) => {
  // check id
  const { queryStringObject } = data
  const id =
    typeof queryStringObject != "string" &&
    typeof queryStringObject.id == "string" &&
    queryStringObject.id.trim().length == 20
      ? queryStringObject.id
      : ""

  if (id) {
    _data.read("tokens", id, (err, data) => {
      if (!err && data) {
        callback(200, data)
      } else {
        callback(404, { Error: "Token not found" })
      }
    })
  } else {
    callback(404, { Error: "Token format not valid" })
  }
}

export default get
