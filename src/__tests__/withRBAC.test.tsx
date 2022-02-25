import React from "react";
import { render } from "@testing-library/react";
import { RBACContextProvider } from "..";
import ComponentWithHOC from "../components/ComponentWithHOC";

describe("withRBAC", () => {
  it("Should display component when permissions valid", () => {
    render(
      <RBACContextProvider permissions={["delete_all"]}>
        <ComponentWithHOC />
      </RBACContextProvider>
    );
  });
  it("Should hide component when permissions not valid", () => {
    render(
      <RBACContextProvider permissions={[]}>
        <ComponentWithHOC />
      </RBACContextProvider>
    );
  });
});
