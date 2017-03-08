'use strict'

const PromiseReadable = require('../lib/promise-readable')
const fs = require('fs')

async function main () {
  const rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || '/etc/hosts'))
  const data = await rstream.readAll()
  console.log(`Read ${data.length} bytes in total`)
}

main()
