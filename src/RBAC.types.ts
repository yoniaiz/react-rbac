export interface ChildrenProps {
  hasRequiredPermissions: boolean;
  hasRequiredRoles: boolean;
}

export interface RequiredRBAC<
  R extends string = string,
  P extends string = string
> {
  requiredRoles?: R[];
  requiredPermissions?: P[];
}

export interface RBACComponentProps<
  R extends string = string,
  P extends string = string
> extends RequiredRBAC<R, P> {
  children:
    | React.ReactElement
    | (({
        hasRequiredPermissions,
        hasRequiredRoles,
      }: ChildrenProps) => React.ReactElement);
  fallback?: React.ReactNode;
  blockedComponentPropsOverride?: Record<string, unknown>;
  hideWhenBlocked?: boolean;
  oneOf?: boolean;
}

export interface RBACContextState<
  R extends string = string,
  P extends string = string
> {
  existingRolesNorm: Record<R, R>;
  existingPermissionsNorm: Record<P, P>;
  existingPermissions: P[];
  existingRoles: R[];
  blockedRoles: Record<string, string>;
  addedRoles: Record<string, string>;
  blockedPermissions: Record<string, string>;
  addedPermissions: Record<string, string>;
}

export interface RBACContextProps<
  R extends string = string,
  P extends string = string
> extends RBACContextState<R, P> {
  addPermissions: (added: string[]) => void;
  blockPermissions: (blocked: string[]) => void;
  addRoles: (added: string[]) => void;
  blockRoles: (blocked: string[]) => void;
  resetRoles: () => void;
  resetPermissions: () => void;
  resetAll: () => void;
}

export interface RBACProviderProps<R extends string, P extends string> {
  roles?: R[];
  permissions?: P[];
  children:
    | ((props: RBACContextProps<R, P>) => React.ReactNode)
    | React.ReactNode;
}
