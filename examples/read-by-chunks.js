#!/usr/bin/env node

import fs from "node:fs"

import PromiseReadable from "../lib/promise-readable.js"

async function main() {
  const rstream = new PromiseReadable(
    fs.createReadStream(process.argv[2] || __filename, {
      highWaterMark: Number(process.argv[3]) || 1024,
    }),
  )

  let total = 0

  for (let chunk; (chunk = await rstream.read()); ) {
    console.info(`Read ${chunk.length} bytes chunk`)
    total += chunk.length
  }

  console.info(`Read ${total} bytes in total`)

  rstream.destroy()
}

main().catch(console.error)
