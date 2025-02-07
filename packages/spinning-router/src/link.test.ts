import { unsafeLink } from "./link";

test("link", async () => {
  expect(unsafeLink("/foo/:baz", { baz: 42 })).toEqual("#/foo/42");
});
