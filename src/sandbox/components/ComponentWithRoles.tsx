import React, { useState } from 'react';
import { PermissionsView } from './PermissionsView';
import { RBACComponent } from '../../RBACComponent';

export const ComponentWithRoles = () => {
  const [requiredRoles, setRequiredRoles] = useState(['admin']);
  return (
    <div>
      <h2>RBAC Component</h2>
      <PermissionsView
        addPermission={(value) => setRequiredRoles((prev) => [...prev, value])}
        removePermission={(per) =>
          setRequiredRoles((prev) => prev.filter((r) => r !== per))
        }
        permissions={requiredRoles}
        label="Required Roles for component"
      />
      <RBACComponent
        requiredRoles={requiredRoles}
        blockedComponentPropsOverride={{ style: { background: 'green' } }}
      >
        <div style={{ width: '100px', height: '100px', background: 'red' }}>
          hi
        </div>
      </RBACComponent>
    </div>
  );
};
