import React from "react";
import {
  useRBACContext,
  useRBACComponentPermissions,
  useHasRoles,
  useHasPermissions,
} from "./RBAC.hooks";
import { RBACComponent } from "./RBACComponent";
import { withRBAC } from "./withRBAC";
import { RBACContextProvider } from "./RBACContext";
import {
  RBACComponentProps,
  RBACContextProps,
  RBACContextState,
  RBACProviderProps,
} from "./RBAC.types";

export function RBACFactory<R extends string, P extends string>(): {
  RBAC: {
    Provider: React.ComponentClass<
      RBACProviderProps<R, P>,
      RBACContextState<R, P>
    >;
    Component: (props: RBACComponentProps<R, P>) => JSX.Element;
    with: (
      WrappedComponent: React.ComponentType<object>,
      rbacProps: Omit<RBACComponentProps<R, P>, "children">
    ) => (props: object) => JSX.Element;
    useContext: () => RBACContextProps<R, P>;
    useComponentPermissions: (
      requiredRoles: R[],
      requiredPermissions: P[]
    ) => ReturnType<typeof useRBACComponentPermissions>;
    useHasRoles: (roles: R[]) => ReturnType<typeof useHasRoles>;
    useHasPermissions: (
      permissions: P[]
    ) => ReturnType<typeof useHasPermissions>;
  };
} {
  return {
    RBAC: {
      Provider: RBACContextProvider,
      with: withRBAC,
      Component: RBACComponent,
      useContext: useRBACContext,
      useComponentPermissions: useRBACComponentPermissions,
      useHasRoles,
      useHasPermissions,
    },
  };
}
