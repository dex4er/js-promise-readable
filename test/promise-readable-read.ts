import chai, {expect} from "chai"

import dirtyChai from "dirty-chai"
chai.use(dirtyChai)

import {And, Feature, Given, Scenario, Then, When} from "./lib/steps"

import {MockStreamReadable} from "./lib/mock-stream-readable"

import {PromiseReadable} from "../src/promise-readable"

Feature("Test promise-readable module for read method", () => {
  Scenario("Read chunks from stream", () => {
    let chunk: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream contains some data", () => {
      stream.append(Buffer.from("chunk1"))
    })

    And("I call read method", async () => {
      chunk = await promiseReadable.read()
    })

    Then("promise returns chunk", () => {
      expect(chunk).to.deep.equal(Buffer.from("chunk1"))
    })

    When("stream contains some another data", () => {
      stream.append(Buffer.from("chunk2"))
    })

    And("I call read method again", async () => {
      chunk = await promiseReadable.read()
    })

    Then("promise returns another chunk", () => {
      expect(chunk).to.deep.equal(Buffer.from("chunk2"))
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })
  })

  Scenario("Read chunks from stream with encoding", () => {
    let chunk: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("stream contains some data", () => {
      stream.append(Buffer.from("chunk1"))
    })

    And("I set encoding", () => {
      promiseReadable.setEncoding("utf8")
    })

    And("I call read method", async () => {
      chunk = await promiseReadable.read()
    })

    Then("promise returns chunk", () => {
      expect(chunk).to.deep.equal("chunk1")
    })

    When("stream contains some another data", () => {
      stream.append(Buffer.from("chunk2"))
    })

    And("I call read method again", async () => {
      chunk = await promiseReadable.read()
    })

    Then("promise returns another chunk", () => {
      expect(chunk).to.deep.equal("chunk2")
    })
  })

  Scenario("Read empty stream", () => {
    let chunk: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When("I call read method", async () => {
      chunk = await promiseReadable.read()
    })

    Then("promise returns undefined value", () => {
      expect(chunk).to.be.undefined()
    })
  })

  Scenario("Read closed stream", () => {
    let chunk: string | Buffer | undefined
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    And("stream is closed", () => {
      return stream.close()
    })

    When("I call read method", async () => {
      chunk = await promiseReadable.read()
    })

    Then("promise returns undefined value", () => {
      expect(chunk).to.be.undefined()
    })
  })

  Scenario("Read destroyed stream", () => {
    let chunk: string | Buffer | undefined
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

    And("I call read method", async () => {
      chunk = await promiseReadable.read()
    })

    Then("promise returns undefined value", () => {
      expect(chunk).to.be.undefined()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })
  })

  Scenario("Read stream with error", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream will emit an error" event', () => {
      stream.setError(new Error("boom"))
    })

    And("I call read method", () => {
      promiseReadable.read().catch(err => {
        error = err
      })
    })

    Then("promise is rejected", () => {
      expect(error)
        .to.be.an("error")
        .with.property("message", "boom")
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })

    And("PromiseReadable object can be destroyed", () => {
      promiseReadable.destroy()
    })
  })

  Scenario("Read stream with emitted error", () => {
    let error: Error
    let promiseReadable: PromiseReadable<MockStreamReadable>
    let stream: MockStreamReadable

    Given("Readable object", () => {
      stream = new MockStreamReadable()
    })

    And("PromiseReadable object", () => {
      promiseReadable = new PromiseReadable(stream)
    })

    When('stream emitted an error" event', () => {
      stream.emit("error", new Error("boom"))
    })

    And("I call read method", async () => {
      try {
        await promiseReadable.read()
      } catch (e) {
        error = e
      }
    })

    Then("promise is rejected", () => {
      expect(error)
        .to.be.an("error")
        .with.property("message", "boom")
    })
  })
})
