import { PromiseReadable } from '../lib/promise-readable'

import { createReadStream } from 'fs'

async function main () {
  const rstream = new PromiseReadable(createReadStream(process.argv[2] || '/etc/hosts'))
  let total = 0
  for (let chunk: Buffer; (chunk = await rstream.read()) !== null;) {
    console.info(`Read ${chunk.length} bytes chunk`)
    total += chunk.length
  }
  console.info(`Read ${total} bytes in total`)
}

main().catch(console.error)
