import { link } from "./link";

test("link", async () => {
  expect(link("/foo/:baz", { baz: 42 })).toEqual("#/foo/42");
});
