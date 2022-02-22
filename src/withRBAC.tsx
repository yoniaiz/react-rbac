import React from "react";
import { RBACComponent, useRBACContext } from ".";
import { RBACComponentProps } from "./RBAC.types";

export function withRBAC<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  rbacProps: Omit<RBACComponentProps, "children">
) {
  const ComponentWithRBAC = (props: T) => {
    return (
      <RBACComponent {...rbacProps}>
        <WrappedComponent {...props} />
      </RBACComponent>
    );
  };
  return ComponentWithRBAC;
}
