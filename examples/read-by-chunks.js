'use strict'

const PromiseReadable = require('../lib/promise-readable')
const fs = require('fs')

async function main () {
  const rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || '/etc/hosts'))
  let total = 0
  for (let chunk; (chunk = await rstream.read()) !== null;) {
    console.log(`Read ${chunk.length} bytes chunk`)
    total += chunk.length
  }
  console.log(`Read ${total} bytes in total`)
}

main().catch(console.error)
