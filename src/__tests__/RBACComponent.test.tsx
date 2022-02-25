import React from "react";
import { RBACComponent } from "../RBACComponent";
import { render, screen } from "@testing-library/react";
import { RBACContextProvider } from "../RBACContext";

describe("RBAC Component", () => {
  it("Should throw error when component not wrapped with RBAC context", () => {
    const s = jest.spyOn(console, "error").mockImplementation(() => jest.fn());
    expect(() =>
      render(
        <RBACComponent>
          <div>hi</div>
        </RBACComponent>
      )
    ).toThrow("Please connect RBAC context");
    s.mockRestore();
  });

  it("Should display component when all roles valid", () => {
    render(
      <RBACContextProvider roles={["guest", "admin"]}>
        <RBACComponent requiredRoles={["admin"]}>
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("Should display component when all permissions valid", () => {
    render(
      <RBACContextProvider permissions={["something", "get_all_credits"]}>
        <RBACComponent requiredPermissions={["get_all_credits"]}>
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("Should hide component when roles not valid", () => {
    render(
      <RBACContextProvider roles={["admin"]}>
        <RBACComponent requiredRoles={["admin", "guest"]}>
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.queryByText("test")).not.toBeInTheDocument();
  });

  it("Should hide component when permissions not valid", () => {
    render(
      <RBACContextProvider permissions={["get_all_credits"]}>
        <RBACComponent
          requiredPermissions={["get_all_credits", "delete_all_credits"]}
        >
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.queryByText("test")).not.toBeInTheDocument();
  });

  it("Should replace component", () => {
    render(
      <RBACContextProvider permissions={["get_all_credits"]}>
        <RBACComponent
          requiredPermissions={["get_all_credits", "delete_all_credits"]}
          fallback={<div>fallback</div>}
        >
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.queryByText("fallback")).toBeInTheDocument();
  });

  it("Should change styled to blocked component", () => {
    render(
      <RBACContextProvider permissions={["get_all_credits"]}>
        <RBACComponent
          requiredPermissions={["get_all_credits", "delete_all_credits"]}
          hideWhenBlocked={false}
          blockedComponentPropsOverride={{ style: { color: "green" } }}
        >
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.queryByText("test")).toHaveStyle({ color: "green" });
  });

  it("Children should be able to receive state", () => {
    render(
      <RBACContextProvider permissions={["get_all_credits"]}>
        <RBACComponent
          requiredPermissions={["get_all_credits", "delete_all_credits"]}
        >
          {({ hasRequiredPermissions }) => (
            <div>{hasRequiredPermissions ? "test" : "blocked"}</div>
          )}
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.queryByText("blocked")).toBeInTheDocument();
  });
});
