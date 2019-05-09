export class MockPromiseWritable<TWritable extends NodeJS.WritableStream> {
  isPromiseWritable = true
  constructor(readonly stream: TWritable) {}
}
