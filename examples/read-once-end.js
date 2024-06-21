#!/usr/bin/env node

import fs from "node:fs"

import PromiseReadable from "../lib/promise-readable.js"

const rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || "/etc/hosts"))

rstream.stream.pipe(process.stdout)

rstream.once("end").then(function () {
  console.info("-- End of file")
  rstream.destroy()
})
