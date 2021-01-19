/*
 *
 * Token delete subhandler
 *
 */
//import from local modules
import _data from "../../data"

import { Handler } from "../"

const del: Handler = (data, callback) => {
  // check token id
  const { queryStringObject } = data
  const id =
    typeof queryStringObject != "string" &&
    typeof queryStringObject.id == "string" &&
    queryStringObject.id.trim().length == 20
      ? queryStringObject.id
      : ""

  // if id, delete token
  if (id) {
    _data.delete("tokens", id, (err) => {
      if (!err) {
        callback(204)
      } else {
        callback(400, { Error: "Token not found" })
      }
    })
  } else {
    // if token not found
    callback(400, { Error: "Please provide a valid token id" })
  }
}

export default del
