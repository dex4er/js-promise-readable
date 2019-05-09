#!/usr/bin/env ts-node

import fs from 'fs'

import PromiseReadable from '../src/promise-readable'

const rstream = new PromiseReadable(fs.createReadStream(process.argv[2] || '/etc/hosts'))

rstream.stream.pipe(process.stdout)

rstream.once('end').then(() => {
  console.info('-- End of file')
  rstream.destroy()
})
