import React, { createContext, memo, useContext, useMemo } from "react";

interface ContextProps {
  existingRoles: Record<string, string>;
  existingPermissions: Record<string, string>;
}

export const RBACContext = createContext<ContextProps>({
  existingRoles: null,
  existingPermissions: null,
});

interface ProviderProps {
  roles: string[];
  permissions: string[];
  children: React.ReactNode;
}

export const RBACContextProvider = memo(
  ({ children, roles = [], permissions = [] }: ProviderProps) => {
    const memoizedPermission = useMemo(() => {
      const existingRoles = {};
      const existingPermissions = {};

      for (const role of roles) {
        existingRoles[role] = role;
      }
      for (const permission of permissions) {
        existingPermissions[permission] = permission;
      }

      return { existingRoles, existingPermissions };
    }, [roles, permissions]);

    return (
      <RBACContext.Provider
        value={{
          existingRoles: memoizedPermission.existingRoles,
          existingPermissions: memoizedPermission.existingPermissions,
        }}
      >
        {children}
      </RBACContext.Provider>
    );
  }
);

export const useRBACContext = () => useContext(RBACContext);
