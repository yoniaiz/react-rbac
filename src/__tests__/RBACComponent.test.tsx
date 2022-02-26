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

    expect(screen.queryByText("test")).toBeNull();
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

    expect(screen.queryByText("test")).toBeNull();
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

    expect(screen.getByText("fallback")).toBeInTheDocument();
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

    expect(screen.getByText("test")).toHaveStyle({ color: "green" });
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

    expect(screen.getByText("blocked")).toBeInTheDocument();
  });

  it("Should display component when oneOf roles satisfied", () => {
    render(
      <RBACContextProvider roles={["guest"]}>
        <RBACComponent requiredRoles={["admin", "guest"]} oneOf>
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("Should display component when oneOf permissions satisfied", () => {
    render(
      <RBACContextProvider permissions={["get_all"]}>
        <RBACComponent requiredPermissions={["delete_all", "get_all"]} oneOf>
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("On of for roles + permissions", () => {
    render(
      <RBACContextProvider permissions={["get_all"]} roles={["admin"]}>
        <RBACComponent
          requiredPermissions={["delete_all", "get_all"]}
          requiredRoles={["owner", "admin"]}
          oneOf
        >
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("Has permissions but don't have roles ", () => {
    render(
      <RBACContextProvider permissions={["get_all"]} roles={["admin"]}>
        <RBACComponent
          requiredPermissions={["delete_all", "get_all"]}
          requiredRoles={["owner"]}
          oneOf
        >
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.queryByText("test")).toBeNull();
  });
  it("Has roles but don't have permissions ", () => {
    render(
      <RBACContextProvider permissions={["get_all"]} roles={["admin"]}>
        <RBACComponent
          requiredPermissions={["delete_all"]}
          requiredRoles={["admin"]}
          oneOf
        >
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.queryByText("test")).toBeNull();
  });

  it("Required permissions on roles ", () => {
    render(
      <RBACContextProvider
        permissions={["delete_all", "get_all"]}
        roles={["admin", "owner"]}
      >
        <RBACComponent
          requiredPermissions={["delete_all", "get_all"]}
          requiredRoles={["admin", "owner"]}
        >
          <div>test</div>
        </RBACComponent>
      </RBACContextProvider>
    );

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
