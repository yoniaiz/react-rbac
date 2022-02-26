import { useRBACContext, useRBACComponentPermissions, useHasRoles, useHasPermissions, } from './RBAC.hooks';
import { RBACComponent } from './RBACComponent';
import { withRBAC } from './withRBAC';
import { RBACContextProvider } from './RBACContext';
export function RBACFactory() {
    return {
        RBAC: {
            Provider: RBACContextProvider,
            with: withRBAC,
            Component: RBACComponent,
            useContext: useRBACContext,
            useComponentPermissions: useRBACComponentPermissions,
            useHasRoles: useHasRoles,
            useHasPermissions: useHasPermissions,
        },
    };
}
//# sourceMappingURL=RBACFactory.js.map