import { checkIfRBACValid } from "./RBAC.utils";
import { useRBACContext } from "./RBACContext";

export const useRBACComponentPermissions = (
  requiredRoles: string[],
  requiredPermissions: string[]
) => {
  const {
    existingRolesNorm,
    existingPermissionsNorm,
    addedPermissions,
    addedRoles,
    blockedRoles,
    blockedPermissions,
  } = useRBACContext();

  const hasRequiredRoles = checkIfRBACValid({
    required: requiredRoles,
    existing: existingRolesNorm,
    added: addedRoles,
    blocked: blockedRoles,
  });

  const hasRequiredPermissions = checkIfRBACValid({
    required: requiredPermissions,
    existing: existingPermissionsNorm,
    added: addedPermissions,
    blocked: blockedPermissions,
  });
  return { hasRequiredRoles, hasRequiredPermissions };
};

export const useHasRoles = (roles: string[]) => {
  const { existingRolesNorm, addedRoles, blockedRoles } = useRBACContext();

  return roles.map((permission) => ({
    existing: !!existingRolesNorm[permission],
    added: !!addedRoles[permission],
    blocked: !!blockedRoles[permission],
  }));
};

export const useHasPermissions = (permissions: string[]) => {
  const { existingPermissionsNorm, addedPermissions, blockedPermissions } =
    useRBACContext();

  return permissions.map((permission) => ({
    existing: !!existingPermissionsNorm[permission],
    added: !!addedPermissions[permission],
    blocked: !!blockedPermissions[permission],
  }));
};
