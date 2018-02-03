'use strict'

var PromiseReadable = require('../lib/promise-readable').PromiseReadable
var createReadStream = require('fs').createReadStream

var rstream = new PromiseReadable(createReadStream(process.argv[2] || '/etc/hosts'))

rstream.stream.pipe(process.stdout)

rstream.once('end')
.then(function () {
  console.log('-- End of file')
  rstream.destroy()
})
