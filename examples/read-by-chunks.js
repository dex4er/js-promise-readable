'use strict'

const { PromiseReadable } = require('../lib/promise-readable')
const { createReadStream } = require('fs')

async function main () {
  const rstream = new PromiseReadable(createReadStream(process.argv[2] || '/etc/hosts'))

  let total = 0

  for (let chunk; (chunk = await rstream.read());) {
    console.log(`Read ${chunk.length} bytes chunk`)
    total += chunk.length
  }

  console.log(`Read ${total} bytes in total`)

  rstream.destroy()
}

main().catch(console.error)
