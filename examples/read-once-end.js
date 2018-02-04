'use strict'

var PromiseReadable = require('../lib/promise-readable')
var fs = require('fs')

var rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || '/etc/hosts'))

rstream.stream.pipe(process.stdout)

rstream.once('end')
.then(function () {
  console.log('-- End of file')
  rstream.destroy()
})
