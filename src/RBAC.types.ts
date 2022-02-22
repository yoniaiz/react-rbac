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
