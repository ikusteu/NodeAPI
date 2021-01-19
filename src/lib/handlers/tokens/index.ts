/*
 *
 * Token subhandlers
 *
 */
// import each handler
import get from "./get"
import post from "./post"
import put from "./put"
import del from "./delete"

// import types
import { HandlersObject } from "../"

const _tokens: HandlersObject = {
  post,
  get,
  put,
  delete: del,
}

export default _tokens
