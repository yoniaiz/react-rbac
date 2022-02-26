import React, { cloneElement } from 'react';
import { BLOCKED_CLASS_NAME } from './RBAC.constants';
import { useHasPermissions, useHasRoles } from './RBAC.hooks';
import { RBACComponentProps } from './RBAC.types';

export const RBACWrapper = <
  R extends string = string,
  P extends string = string
>({
  requiredRoles,
  requiredPermissions,
  children,
  fallback,
  blockedComponentPropsOverride = {},
  hideWhenBlocked = true,
  oneOf = false,
}: RBACComponentProps<R, P>): JSX.Element => {
  const hasRequiredRoles = useHasRoles(requiredRoles, oneOf);
  const hasRequiredPermissions = useHasPermissions(requiredPermissions, oneOf);

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
