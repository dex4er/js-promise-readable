'use strict'

const fs = require('fs')

const {PromiseReadable} = require('../lib/promise-readable')

async function main() {
  const rstream = new PromiseReadable(
    fs.createReadStream(process.argv[2] || __filename, {
      highWaterMark: Number(process.argv[3]) || 1024,
    }),
  )

  let total = 0

  for (let chunk; (chunk = await rstream.read()); ) {
    console.log(`Read ${chunk.length} bytes chunk`)
    total += chunk.length
  }

  console.log(`Read ${total} bytes in total`)

  rstream.destroy()
}

main().catch(console.error)
