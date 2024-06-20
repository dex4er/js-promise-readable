import {expect} from "chai"

import {PromiseReadable} from "../src/promise-readable.js"

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps.js"

import {MockStreamReadable} from "./lib/mock-stream-readable.js"

Feature('Test promise-readable module for once("end") method', () => {
  Scenario("Wait for end from stream", () => {
    let ended = false
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "end" event', () => {
      promiseReadable.once("end").then(() => {
        ended = true
      })
    })

    And('"data" event is emitted', () => {
      stream.emit("data", Buffer.from("chunk1"))
    })

    And('another "data" event is emitted', () => {
      stream.emit("data", Buffer.from("chunk2"))
    })

    And('"close" event is emitted', () => {
      stream.emit("end")
    })

    Then("promise returns no result", () => {
      expect(ended).to.be.true
    })
  })

  Scenario("Wait for end from stream with error", () => {
    let error: any
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "end" event', () => {
      promiseReadable.once("end").catch(err => {
        error = err
      })
    })

    And('"data" event is emitted', () => {
      stream.emit("data", Buffer.from("chunk1"))
    })

    And('"error" event is emitted', () => {
      stream.emit("error", new Error("boom"))
    })

    Then("promise is rejected", () => {
      expect(error).to.be.an("error").with.property("message", "boom")
    })
  })

  Scenario("Wait for end from stream with emitted error", () => {
    let error: any
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    And('"data" event is emitted', () => {
      stream.emit("data", Buffer.from("chunk1"))
    })

    When('I wait for "end" event', () => {
      promiseReadable.once("end").catch(err => {
        error = err
      })
    })

    And('"error" event is emitted', () => {
      stream.emit("error", new Error("boom"))
    })

    Then("promise is rejected", () => {
      expect(error).to.be.an("error").with.property("message", "boom")
    })
  })
})
