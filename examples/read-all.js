'use strict'

const PromiseReadable = require('../lib/promise-readable')
const fs = require('fs')

async function main () {
  const rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || '/etc/hosts', {
    highWaterMark: Number(process.argv[3]) || 1024
  }))
  const data = await rstream.readAll()
  if (data != null) {
    console.log(`Read ${data.length} bytes in total`)
    rstream.destroy()
  }
}

main().catch(console.error)
