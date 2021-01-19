/*
 *
 * Router for checks subhandlers
 *
 */

// import types
import { HandlersObject } from "../"

// import each subhandler
import get from "./get"
import post from "./post"
import put from "./put"
import del from "./delete"

const _checks: HandlersObject = {
  post,
  get,
  put,
  delete: del,
}

export default _checks
