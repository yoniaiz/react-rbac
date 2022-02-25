export interface ChildrenProps {
  hasRequiredPermissions: boolean;
  hasRequiredRoles: boolean;
}

export interface RequiredRBAC {
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export interface RBACComponentProps extends RequiredRBAC {
  children:
    | React.ReactElement
    | (({
        hasRequiredPermissions,
        hasRequiredRoles,
      }: ChildrenProps) => React.ReactElement);
  fallback?: React.ReactNode;
  blockedComponentPropsOverride?: Record<string, unknown>;
  hideWhenBlocked?: boolean;
}

export interface RBACContextState {
  existingRolesNorm: Record<string, string>;
  existingPermissionsNorm: Record<string, string>;
  existingPermissions: string[];
  existingRoles: string[];
  blockedRoles: Record<string, string>;
  addedRoles: Record<string, string>;
  blockedPermissions: Record<string, string>;
  addedPermissions: Record<string, string>;
}

export interface RBACContextProps extends RBACContextState {
  addPermissions: (added: string[]) => void;
  blockPermissions: (blocked: string[]) => void;
  addRoles: (added: string[]) => void;
  blockRoles: (blocked: string[]) => void;
  resetRoles: () => void;
  resetPermissions: () => void;
  resetAll: () => void;
}

export interface RBACProviderProps {
  roles?: string[];
  permissions?: string[];
  children: ((props: RBACContextProps) => React.ReactNode) | React.ReactNode;
}
