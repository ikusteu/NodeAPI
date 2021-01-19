/**
 *
 * Request handlers for the API
 *
 */
//import from node modules
import http from "http"
import url from "url"

// import subhandlers
import _users from "./users"
import _tokens from "./tokens"

// local types and interfaces
export interface DataPayload {
  trimmedPath: string
  queryStringObject: string | url.UrlWithParsedQuery["query"]
  method: string
  headers: http.IncomingHttpHeaders
  payload: Record<string, unknown> | false
}

export interface Handler {
  (
    data: DataPayload,
    callback: (code: unknown, data?: Record<string, unknown>) => void
  ): void
}

export interface HandlersObject {
  [index: string]: Handler
}

// define handlers
const handlers = {
  // ping handler
  ping: (data, callback) => {
    callback(200)
  },

  // users endpoint
  users: (data, callback) => {
    const acceptableMethods = ["POST", "GET", "PUT", "DELETE"]
    if (acceptableMethods.includes(data.method)) {
      _users[data.method.toLowerCase()](data, callback)
    } else {
      callback(405)
    }
  },

  // tokens endpoint
  tokens: (data, callback) => {
    const acceptableMethods = ["POST", "GET", "PUT", "DELETE"]
    if (acceptableMethods.includes(data.method)) {
      _tokens[data.method.toLowerCase()](data, callback)
    } else {
      callback(405)
    }
  },

  // 404
  notFound: (data, callback) => {
    callback(404)
  },
} as HandlersObject

export default handlers
