import React, { cloneElement } from 'react';
import { BLOCKED_CLASS_NAME } from './RBAC.constants';
import { useRBACComponentPermissions } from './RBAC.hooks';
import { RBACComponentProps } from './RBAC.types';

export const RBACComponent = <
  R extends string = string,
  P extends string = string
>({
  requiredRoles,
  requiredPermissions,
  children,
  fallback,
  blockedComponentPropsOverride = {},
  hideWhenBlocked = true,
  oneOf,
}: RBACComponentProps<R, P>): JSX.Element => {
  const { hasRequiredRoles, hasRequiredPermissions } =
    useRBACComponentPermissions(requiredRoles, requiredPermissions, oneOf);

  if (typeof children === 'function') {
    return children({ hasRequiredPermissions, hasRequiredRoles });
  }

  if (hasRequiredPermissions && hasRequiredRoles) {
    return children;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!hideWhenBlocked) {
    return cloneElement(children, {
      className: BLOCKED_CLASS_NAME,
      ...blockedComponentPropsOverride,
    });
  }

  return null;
};
