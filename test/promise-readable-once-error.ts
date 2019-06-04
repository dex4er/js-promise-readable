import {expect} from "chai"

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import {MockStreamReadable} from "./lib/mock-stream-readable"

import {PromiseReadable} from "../src/promise-readable"

Feature('Test promise-readable module for once("error") method', () => {
  Scenario("Wait for error from stream without error", () => {
    let promiseFulfilled = false
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "error" event', () => {
      promiseReadable.once("error").then(() => {
        promiseFulfilled = true
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
      return expect(promiseFulfilled).to.be.true
    })
  })

  Scenario("Wait for error from stream with error", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "error" event', () => {
      promiseReadable.once("error").catch(err => {
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
      return expect(error)
        .to.be.an("error")
        .with.property("message", "boom")
    })
  })

  Scenario("Wait for error from stream with emitted error", () => {
    let error: Error
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

    When('I wait for "error" event', () => {
      promiseReadable.once("error").catch(err => {
        error = err
      })
    })

    And('"error" event is emitted', () => {
      stream.emit("error", new Error("boom"))
    })

    Then("promise is rejected", () => {
      return expect(error)
        .to.be.an("error")
        .with.property("message", "boom")
    })
  })

  Scenario("Read non-Readable stream", () => {
    let chunk: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Non-Readable object", () => {
      stream = new MockStreamReadable()
      stream.readable = false
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("I call read method", async () => {
      chunk = await promiseReadable.read()
    })

    And('"data" event is emitted', () => {
      stream.emit("data", Buffer.from("chunk1"))
    })

    Then("promise returns undefined value", () => {
      return expect(chunk).to.be.undefined
    })
  })
})
