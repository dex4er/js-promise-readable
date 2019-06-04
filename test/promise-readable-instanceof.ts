import {expect} from "chai"
import semver from "semver"
import {PassThrough} from "stream"

import {And, Feature, Given, Scenario, Then} from "./lib/steps"

import {MockPromiseDuplex} from "./lib/mock-promise-duplex"
import {MockStreamReadable} from "./lib/mock-stream-readable"

import {PromiseReadable} from "../src/promise-readable"

if (semver.gte(process.version, "6.11.3")) {
  Feature("Test promise-readable with instanceof operator", () => {
    Scenario("instanceof operator with MockStreamReadable class", () => {
      let stream: MockStreamReadable

      Given("Readable object", () => {
        stream = new MockStreamReadable()
      })

      Then("other object is not an instance of PromiseReadable class", () => {
        expect(stream).to.be.not.an.instanceof(PromiseReadable)
      })
    })

    Scenario("instanceof operator with PromiseWritable class", () => {
      let promiseReadable: PromiseReadable<MockStreamReadable>
      let stream: MockStreamReadable

      Given("Readable object", () => {
        stream = new MockStreamReadable()
      })

      And("PromiseReadable object", () => {
        promiseReadable = new PromiseReadable(stream)
      })

      Then("PromiseReadable object is an instance of PromiseReadable class", () => {
        expect(promiseReadable).to.be.an.instanceof(PromiseReadable)
      })
    })

    Scenario("instanceof operator with PromiseDuplex class", () => {
      let promiseDuplex: MockPromiseDuplex<PassThrough>
      let stream: PassThrough

      Given("Duplex object", () => {
        stream = new PassThrough()
      })

      And("PromiseDuplex object", () => {
        promiseDuplex = new MockPromiseDuplex(stream)
      })

      Then("PromiseDuplex object is an instance of PromiseReadable class", () => {
        expect(promiseDuplex).to.be.an.instanceof(PromiseReadable)
      })
    })
  })
}
