#!/usr/bin/env ts-node

import fs from "fs"

import PromiseReadable from "../src/promise-readable"

type Chunk = Buffer | string | undefined

async function main(): Promise<void> {
  const rstream = new PromiseReadable(
    fs.createReadStream(process.argv[2] || __filename, {
      highWaterMark: Number(process.argv[3]) || 1024,
    }),
  )

  let total = 0

  for (let chunk: Chunk; (chunk = await rstream.read()); ) {
    console.info(`Read ${chunk.length} bytes chunk`)
    total += chunk.length
  }

  console.info(`Read ${total} bytes in total`)

  rstream.destroy()
}

main().catch(console.error)
