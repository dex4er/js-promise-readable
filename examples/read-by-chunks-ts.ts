import { PromiseReadable } from '../lib/promise-readable'

import { createReadStream } from 'fs'

type Maybe<T> = T | undefined

async function main () {
  const rstream = new PromiseReadable(createReadStream(process.argv[2] || '/etc/hosts'))

  let total = 0

  for (let chunk: Maybe<Buffer>; (chunk = await rstream.read());) {
    console.info(`Read ${chunk.length} bytes chunk`)
    total += chunk.length
  }

  console.info(`Read ${total} bytes in total`)
}

main().catch(console.error)
