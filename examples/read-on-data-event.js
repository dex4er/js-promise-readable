'use strict'

var PromiseReadable = require('../lib/promise-readable')
var fs = require('fs')

var rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || '/etc/hosts'))
var total = 0

rstream.stream.on('data', function (chunk) {
  console.log('Read', chunk.length, 'bytes chunk')
  total += chunk.length
})

rstream.end()
.then(function () {
  console.log('Read', total, 'bytes in total')
})
