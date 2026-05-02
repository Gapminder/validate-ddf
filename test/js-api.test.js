/**
 * JS API integration tests.
 * Tests the public validate() function imported from src/index.js (which loads dist/lib.js).
 * Run with: node --test test/js-api.test.js
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { validate } from "../src/index.js";

const DATASETS = new URL("./datasets/", import.meta.url).pathname;

test("valid-minimal: returns success", async () => {
  const result = await validate(DATASETS + "valid-minimal");
  assert.equal(result.success, "Validation successful.");
  assert.equal(result.errors, null);
  assert.match(result.validatorVersion, /^v\d+\.\d+\.\d+$/);
});

test("error-no-concepts: returns errors", async () => {
  const result = await validate(DATASETS + "error-no-concepts");
  assert.equal(result.success, null);
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0);
});

test("error-no-concepts with onlyErrors: still returns errors", async () => {
  const result = await validate(DATASETS + "error-no-concepts", {
    onlyErrors: true,
  });
  assert.equal(result.success, null);
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0);
});

test("valid-minimal with onlyErrors: returns success, no warnings", async () => {
  const result = await validate(DATASETS + "valid-minimal", {
    onlyErrors: true,
  });
  assert.equal(result.success, "Validation successful.");
  assert.equal(result.errors, null);
});

test("onProgress callback is called at least once", async () => {
  const messages = [];
  const result = await validate(DATASETS + "valid-minimal", {
    onProgress: (msg) => messages.push(msg),
  });
  assert.equal(result.success, "Validation successful.");
  assert.ok(messages.length > 0, "expected at least one progress message");
  assert.ok(
    messages.every((m) => typeof m === "string"),
    "all messages should be strings",
  );
});

test("onProgress is reset after validation (handler does not leak)", async () => {
  let callCount = 0;
  await validate(DATASETS + "valid-minimal", {
    onProgress: () => callCount++,
  });
  const countAfterFirst = callCount;
  assert.ok(countAfterFirst > 0);

  // Second validate without onProgress — callCount must not increase.
  callCount = 0;
  await validate(DATASETS + "valid-minimal");
  assert.equal(callCount, 0, "handler should not leak to subsequent calls");
});
