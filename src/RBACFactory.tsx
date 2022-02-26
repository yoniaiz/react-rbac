import React from 'react';
import {
  useRBACContext,
  useGetPermissionsState,
  useGetRolesState,
  useHasRoles,
  useHasPermissions,
} from './RBAC.hooks';
import { RBACWrapper } from './RBACWrapper';
import { withRBAC } from './withRBAC';
import { RBACProvider } from './RBACContext';
import {
  RBACComponentProps,
  RBACContextProps,
  RBACContextState,
  RBACProviderProps,
} from './RBAC.types';

export function RBACFactory<R extends string, P extends string>(): {
  RBAC: {
    Provider: React.ComponentClass<
      RBACProviderProps<R, P>,
      RBACContextState<R, P>
    >;
    Wrapper: (props: RBACComponentProps<R, P>) => JSX.Element;
    with: (
      WrappedComponent: React.ComponentType<object>,
      rbacProps: Omit<RBACComponentProps<R, P>, 'children'>
    ) => (props: object) => JSX.Element;
    useContext: () => RBACContextProps<R, P>;
    useGetPermissionsState: (
      permissions: P[]
    ) => ReturnType<typeof useGetPermissionsState>;
    useGetRolesState: (roles: R[]) => ReturnType<typeof useGetRolesState>;
    useHasRoles: (roles: R[], oneOf?: boolean) => boolean;
    useHasPermissions: (permissions: P[], oneOf?: boolean) => boolean;
  };
} {
  return {
    RBAC: {
      Provider: RBACProvider,
      with: withRBAC,
      Wrapper: RBACWrapper,
      useContext: useRBACContext,
      useGetPermissionsState,
      useGetRolesState,
      useHasRoles,
      useHasPermissions,
    },
  };
}
