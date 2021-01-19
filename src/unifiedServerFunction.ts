/**
 *
 * Function module for creation of servers based on mode: (http | https)
 *
 */

// import from packages
import http from "http"
import { StringDecoder } from "string_decoder"
import url from "url"

// import router and handlers
import { router } from "./index"
import helpers from "./lib/helpers"

// create function for server creation based on mode
const unifiedServerFunction: http.RequestListener = (req, res) => {
  // parse url
  const parsedUrl = req.url ? url.parse(req.url, true) : ""

  // get path from parsedUrl
  const path = parsedUrl ? parsedUrl.pathname : ""
  const trimmedPath = path?.replace(/^\/+|\/+$/g, "") || ""
  console.log("trimmed path: ", trimmedPath)

  // get query string
  const queryStringObject = parsedUrl ? parsedUrl.query : ""
  console.log("query string object: ", queryStringObject)

  // get request method
  const method = req.method?.toUpperCase() || ""
  console.log("request method: ", method)

  // get headers
  const headers = req.headers
  console.log(headers)

  // init decoder
  const decoder = new StringDecoder("utf-8")

  // get payload
  let buffer = ""
  // process data stream and append "new" string to buffer
  req.on("data", (payload) => {
    buffer += decoder.write(payload)
  })
  // on end of buffer
  req.on("end", () => {
    buffer += decoder.end()
    // end request and callback

    // define chosen handler to be passed to the router
    const chosenHandler =
      trimmedPath && Boolean(router[trimmedPath])
        ? router[trimmedPath]
        : router["notFound"]

    // construct data object
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.safeParse(buffer),
    }

    // route the request to handler specified by router
    chosenHandler(data, (statusCode, payload) => {
      // prepare status code for response
      statusCode = typeof statusCode == "number" ? statusCode : 200

      // prepare payload
      payload = payload || {}
      const stringPayload = JSON.stringify(payload)

      // set response headers to communicate type
      res.setHeader("content-type", "application/json")
      // set response head to http status code
      res.writeHead(statusCode as number)
      // add body to response
      res.end(stringPayload)
    })
  })
}

export default unifiedServerFunction
