import { expect, test } from "vitest";

import { Source } from "../src/source.js";

test('initial value of currentChar is first character "f"', () => {
  const source = new Source("foo\nbar");
  expect(source.currentChar).toBe("f");
});

test("initial charPosition is line 1, character 1", () => {
  const source = new Source("foo\nbar");
  expect(source.charPosition.toString()).toBe("line 1, character 1");
});

test('value of currentChar is "o" after one call to advance()', () => {
  const source = new Source("foo\nbar");
  source.advance();
  expect(source.currentChar).toBe("o");
});

test("charPosition is line 1, character 2 after one call to advance()", () => {
  const source = new Source("foo\nbar");
  source.advance();
  expect(source.charPosition.toString()).toBe("line 1, character 2");
});

test('value of currentChar is "\\n" after three calls to advance()', () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  expect(source.currentChar).toBe("\n");
});

test("charPosition is line 1, character 4 after three calls to advance()", () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  expect(source.charPosition.toString()).toBe("line 1, character 4");
});

test('value of currentChar is "b" after four calls to advance()', () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  expect(source.currentChar).toBe("b");
});

test("charPosition is line 2, character 1 after four calls to advance()", () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  expect(source.charPosition.toString()).toBe("line 2, character 1");
});

test('value of currentChar is "r" after six calls to advance()', () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  expect(source.currentChar).toBe("r");
});

test("charPosition is line 2, character 3 after six calls to advance()", () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  expect(source.charPosition.toString()).toBe("line 2, character 3");
});

test("value of currentChar is EOF after seven calls to advance()", () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  expect(source.currentChar).toBe(source.EOF);
});

test("charPosition is line 2, character 4 after seven calls to advance()", () => {
  const source = new Source("foo\nbar");
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  source.advance();
  expect(source.charPosition.toString()).toBe("line 2, character 4");
});
