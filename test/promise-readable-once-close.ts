import chai, {expect} from "chai"

import dirtyChai from "dirty-chai"
chai.use(dirtyChai)

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import {MockStreamReadable} from "./lib/mock-stream-readable"

import {PromiseReadable} from "../src/promise-readable"

Feature('Test promise-readable module for once("close") method', () => {
  Scenario("Wait for close from stream", () => {
    let closed = false
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "close" event', () => {
      promiseReadable.once("close").then(() => {
        closed = true
      })
    })

    And('"close" event is emitted', () => {
      stream.emit("close")
    })

    Then("promise is fullfiled", () => {
      expect(closed).to.be.true()
    })
  })

  Scenario("Wait for close from stream with error", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "close" event', () => {
      promiseReadable.once("close").catch(err => {
        error = err
      })
    })

    And('"error" event is emitted', () => {
      stream.emit("error", new Error("boom"))
    })

    Then("promise is rejected", () => {
      expect(error)
        .to.be.an("error")
        .with.property("message", "boom")
    })
  })

  Scenario("Wait for close from stream with emitted error", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    And('"error" event is emitted', () => {
      stream.emit("error", new Error("boom"))
    })

    When('I wait for "close" event', () => {
      promiseReadable.once("close").catch(err => {
        error = err
      })
    })

    Then("promise is rejected", () => {
      expect(error)
        .to.be.an("error")
        .with.property("message", "boom")
    })
  })
})
