import {expect} from "chai"

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import {MockStreamReadable} from "./lib/mock-stream-readable"

import {PromiseReadable} from "../src/promise-readable"

Feature('Test promise-readable module for once("close") method', () => {
  Scenario("Wait for open from stream", () => {
    let fd: number
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "open" event', () => {
      promiseReadable.once("open").then(argument => {
        fd = argument
      })
    })

    And("open event is emitted", () => {
      stream.emit("open", 42)
    })

    Then("promise returns result with fd argument", () => {
      expect(fd).to.equal(42)
    })
  })

  Scenario("Wait for open from closed stream", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream is closed", () => {
      stream.close()
    })

    And('I wait for "open" event', () => {
      promiseReadable.once("open").catch(err => {
        error = err
      })
    })

    Then("promise is rejected", () => {
      expect(error)
        .to.be.an("error")
        .with.property("message", "once open after close")
    })
  })

  Scenario("Wait for open from destroyed stream", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream is destroyed", () => {
      stream.destroy()
    })

    And('I wait for "open" event', () => {
      promiseReadable.once("open").catch(err => {
        error = err
      })
    })

    Then("promise is rejected", () => {
      expect(error)
        .to.be.an("error")
        .with.property("message", "once open after destroy")
    })
  })

  Scenario("Wait for open from stream with error", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('I wait for "open" event', () => {
      promiseReadable.once("open").catch(err => {
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

  Scenario("Wait for open from stream with emitted error", () => {
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

    When('I wait for "open" event', () => {
      promiseReadable.once("open").catch(err => {
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
