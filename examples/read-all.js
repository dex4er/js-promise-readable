'use strict'

const { PromiseReadable } = require('../lib/promise-readable')
const { createReadStream } = require('fs')

async function main () {
  const rstream = new PromiseReadable(createReadStream(process.argv[2] || '/etc/hosts'))
  const data = await rstream.readAll()
  if (data != null) {
    console.log(`Read ${data.length} bytes in total`)
    rstream.destroy()
  }
}

main().catch(console.error)
