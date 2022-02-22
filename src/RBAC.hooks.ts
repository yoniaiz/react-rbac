import { RequiredRBAC } from "./RBAC.types";
import { checkIfRBACValid } from "./RBAC.utils";
import { useRBACContext } from "./RBACContext";

export const useRBACComponentPermissions = (
  requiredRoles: string[],
  requiredPermissions: string[]
) => {
  const { existingRoles, existingPermissions } = useRBACContext();

  const hasRequiredRoles = checkIfRBACValid(requiredRoles, existingRoles);
  const hasRequiredPermissions = checkIfRBACValid(
    requiredPermissions,
    existingPermissions
  );

  return { hasRequiredRoles, hasRequiredPermissions };
};

export const useHasRoles = (roles: string[]) => {
  const { existingRoles } = useRBACContext();

  return roles.map((role) => !!existingRoles[role]);
};

export const useHasPermissions = (permissions: string[]) => {
  const { existingPermissions } = useRBACContext();

  return permissions.map((permission) => !!existingPermissions[permission]);
};
