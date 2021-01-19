/**
 *
 * Library for storing and editing data
 *
 */
// import from node modules
import fs from "fs"
import path from "path"

// import from local components
import _data from "./data"
import helpers from "./helpers"

// local types and interfaces
interface ErrorCallback {
  (err: unknown, data?: Record<string, unknown>): void
}

interface DataFunction {
  (
    dir: string,
    file: string,
    callback: ErrorCallback,
    data?: Record<string, unknown>
  ): void
}

interface DataUtilFunctions {
  [index: string]: DataFunction
}

// base directory of the data folder
const baseDir = path.join(process.cwd(), "/.data")

// container
const lib: DataUtilFunctions = {
  // write data to a file
  create: (dir, file, callback, data) => {
    // open the file for writing
    fs.open(`${baseDir}/${dir}/${file}.json`, "wx", (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        const stringData = JSON.stringify(data)
        // write to file and close it
        fs.writeFile(fileDescriptor, stringData, () => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false)
              } else {
                callback("Error closing new file")
              }
            })
          } else {
            callback("Error writing to new file")
          }
        })
      } else {
        callback("Could not create new file, it may already exist")
      }
    })
  },

  // read data from a file
  read: (dir, file, callback) => {
    fs.readFile(`${baseDir}/${dir}/${file}.json`, "utf-8", (err, data) => {
      if (!err && data) {
        const parsedData = helpers.safeParse(data)
        callback(false, parsedData)
      } else {
        callback(err)
      }
    })
  },

  // update data inside a file
  update: (dir, file, callback, data) => {
    // open file for updating
    fs.open(`${baseDir}/${dir}/${file}.json`, "r+", (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert file to string
        const stringData = JSON.stringify(data)

        // truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            // write to file and close it
            fs.write(fileDescriptor, stringData, (err) => {
              if (!err) {
                // close the file
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false)
                  } else {
                    callback("Error closing file")
                  }
                })
              } else {
                callback("Error writing to existing file")
              }
            })
          } else {
            callback("Error truncating file")
          }
        })
      } else {
        callback("Could not open file for updating, it may not exist yet")
      }
    })
  },

  // delete function
  delete: (dir, file, callback) => {
    // unlink  the file from the filesystem
    fs.unlink(`${baseDir}/${dir}/${file}.json`, (err) => {
      if (!err) {
        callback(false)
      } else {
        callback("Error deleting a file")
      }
    })
  },
}

export default lib
