import isEqual from "lodash.isequal";
import { RBACContextState, RBACProviderProps } from "./RBAC.types";

interface CheckIfValidArgs {
  required: string[];
  existing: Record<string, string>;
  added: Record<string, string>;
  blocked: Record<string, string>;
}
export function checkIfRBACValid({
  required,
  existing,
  blocked,
  added,
}: CheckIfValidArgs) {
  if (!required) {
    return true;
  }

  return required.every((r) => !blocked[r] && (!!existing[r] || !!added[r]));
}

export function normalizeArr(arr) {
  if (!arr?.length) return {};

  const norm = {};
  for (const item of arr) {
    norm[item] = item;
  }

  return { ...norm };
}

export function omit(obj: object, key: string) {
  delete obj[key];
}

export function shouldUpdateRBAC(
  nextProps: RBACProviderProps,
  nextState: RBACContextState,
  currentProps: RBACProviderProps,
  currentState: RBACContextState
) {
  if (
    !isEqual(nextProps.permissions, currentProps.permissions) ||
    !isEqual(nextProps.permissions, currentState.existingPermissions)
  ) {
    return true;
  }
  if (
    !isEqual(nextProps.roles, currentProps.roles) ||
    !isEqual(nextProps.roles, currentState.existingRoles)
  ) {
    return true;
  }

  if (!isEqual(nextState.blockedRoles, currentState.blockedRoles)) {
    return true;
  }
  if (!isEqual(nextState.blockedPermissions, currentState.blockedPermissions)) {
    return true;
  }
  if (!isEqual(nextState.addedPermissions, currentState.addedPermissions)) {
    return true;
  }
  if (!isEqual(nextState.addedRoles, currentState.addedRoles)) {
    return true;
  }

  return false;
}
