import { useContext } from 'react';
import { RBACContextProps } from './RBAC.types';
import { checkIfRBACValid } from './RBAC.utils';
import { RBACContext } from './RBACContext';

export const useHasRoles = <R extends string = string>(
  requiredRoles: R[],
  oneOf = false
) => {
  const { existingRolesNorm, addedRoles, blockedRoles } = useRBACContext<
    R,
    string
  >();

  const hasRequiredRoles = checkIfRBACValid<R>({
    required: requiredRoles,
    existing: existingRolesNorm,
    added: addedRoles,
    blocked: blockedRoles,
    oneOf,
  });

  return hasRequiredRoles;
};

export const useHasPermissions = <P extends string = string>(
  requiredPermissions: P[],
  oneOf = false
) => {
  const { existingPermissionsNorm, addedPermissions, blockedPermissions } =
    useRBACContext<string, P>();

  const hasRequiredPermissions = checkIfRBACValid<P>({
    required: requiredPermissions,
    existing: existingPermissionsNorm,
    added: addedPermissions,
    blocked: blockedPermissions,
    oneOf,
  });
  return hasRequiredPermissions;
};

export const useGetRolesState = <
  R extends string = string,
  P extends string = string
>(
  roles: R[]
) => {
  const { existingRolesNorm, addedRoles, blockedRoles } = useRBACContext<
    R,
    P
  >();

  return roles.map((permission) => ({
    existing: !!existingRolesNorm[`${permission}` as R],
    added: !!addedRoles[`${permission}` as R],
    blocked: !!blockedRoles[`${permission}` as R],
  }));
};

export const useGetPermissionsState = <
  R extends string = string,
  P extends string = string
>(
  permissions: P[]
) => {
  const { existingPermissionsNorm, addedPermissions, blockedPermissions } =
    useRBACContext<R, P>();

  return permissions.map((permission) => ({
    existing: !!existingPermissionsNorm[`${permission}` as P],
    added: !!addedPermissions[`${permission}` as P],
    blocked: !!blockedPermissions[`${permission}` as P],
  }));
};

export const useRBACContext = <
  R extends string = string,
  P extends string = string
>(): RBACContextProps<R, P> => {
  const context = useContext(RBACContext);

  if (!context) {
    throw new Error('Please connect RBAC context');
  }

  return context as RBACContextProps<R, P>;
};
