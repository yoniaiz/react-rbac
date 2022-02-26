import isEqual from 'lodash.isequal';
import { RBACContextState, RBACProviderProps } from './RBAC.types';

interface CheckIfValidArgs<R extends string = string> {
  required: R[];
  existing: Record<R, R>;
  added: Record<string, string>;
  blocked: Record<string, string>;
  oneOf?: boolean;
}
export function checkIfRBACValid<R extends string = string>({
  required,
  existing,
  blocked,
  added,
  oneOf,
}: CheckIfValidArgs<R>) {
  if (!required) {
    return true;
  }

  if (oneOf) {
    return required.some(
      (r) => !blocked[`${r}`] && (!!existing[`${r}` as R] || !!added[`${r}`])
    );
  }

  return required.every(
    (r) => !blocked[`${r}`] && (!!existing[`${r}` as R] || !!added[`${r}`])
  );
}

export function normalizeArr<T extends string>(arr: T[]): Record<T, T> {
  if (!arr?.length) return {} as Record<T, T>;

  const norm = {} as Record<T, T>;
  for (const item of arr) {
    norm[`${item}` as T] = item;
  }

  return { ...norm };
}

export function omit(obj: object, key: string) {
  delete obj[`${key}`];
}

export function shouldUpdateRBAC<R extends string, P extends string>(
  nextProps: RBACProviderProps<R, P>,
  nextState: RBACContextState,
  currentProps: RBACProviderProps<R, P>,
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
