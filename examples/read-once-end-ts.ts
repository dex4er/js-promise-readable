#!/usr/bin/env -S node --experimental-specifier-resolution=node --no-warnings --loader ts-node/esm

import fs from "node:fs"

import PromiseReadable from "../src/promise-readable"

const rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || "/etc/hosts"))

rstream.stream.pipe(process.stdout)

rstream.once("end").then(() => {
  console.info("-- End of file")
  rstream.destroy()
})
