import React from "react";

import { test } from "@jest/globals";

import { link } from "./link";

test("link", async () => {
  const companyId = 42;
  expect(link`/${companyId}/hello`).toEqual("#/42/hello");
});
