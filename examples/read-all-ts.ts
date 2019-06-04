#!/usr/bin/env ts-node

import fs from "fs"

import PromiseReadable from "../src/promise-readable"

async function main(): Promise<void> {
  const rstream = new PromiseReadable(
    fs.createReadStream(process.argv[2] || __filename, {
      highWaterMark: Number(process.argv[3]) || 1024,
    }),
  )
  const data = await rstream.readAll()
  if (data !== undefined) {
    console.info(`Read ${data.length} bytes in total`)
    rstream.destroy()
  }
}

main().catch(console.error)
