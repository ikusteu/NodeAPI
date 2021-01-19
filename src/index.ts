/*
 *
 *  Node Api
 *
 */

// import from packages
import http from "http"
import https from "https"
import fs from "fs"
import path from "path"

// import enviorment configs
import { enviormentToExport as config } from "./lib/config"

// import server listener function
import unifiedServerFunction from "./unifiedServerFunction"

// import router handlers
import handlers, { HandlersObject } from "./lib/handlers"

interface RouterObject extends HandlersObject {}

// create and start http server
const httpServer = http.createServer(unifiedServerFunction)
httpServer.listen(config.port.http, () => {
  console.log(
    `listening to http at localhost:${config.port.http}, in ${config.envName} mode`
  )
})

// create and start https server
const httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../https/cert.pem")),
}
const httpsServer = https.createServer(
  httpsServerOptions,
  unifiedServerFunction
)
httpsServer.listen(config.port.https, () => {
  console.log(
    `listening to https at localhost:${config.port.https}, in ${config.envName} mode`
  )
})

// define router
export const router: RouterObject = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
  notFound: handlers.notFound,
}
