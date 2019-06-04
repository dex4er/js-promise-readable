"use strict"

var fs = require("fs")

var PromiseReadable = require("../lib/promise-readable").default

var rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || "/etc/hosts"))

rstream.stream.pipe(process.stdout)

rstream.once("end").then(function() {
  console.info("-- End of file")
  rstream.destroy()
})
