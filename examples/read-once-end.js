#!/usr/bin/env node

"use strict"

const fs = require("fs")

const {PromiseReadable} = require("../lib/promise-readable")

const rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || "/etc/hosts"))

rstream.stream.pipe(process.stdout)

rstream.once("end").then(function() {
  console.info("-- End of file")
  rstream.destroy()
})
