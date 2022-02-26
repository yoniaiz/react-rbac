import React, { useState } from 'react';
import { PermissionsView } from './PermissionsView';
import { RBACWrapper } from '../../RBACWrapper';
import { RBAC } from '../RBAC';

export const ComponentWithPermissions = () => {
  const [requiredPermissions, setRequiredPermissions] = useState(['get_all']);
  const a = RBAC.useHasRoles(['admin']);
  return (
    <div>
      <h2>RBAC Component</h2>
      <RBAC.Wrapper requiredRoles={['owner', 'admin']} oneOf>
        <div>ADMIN</div>
      </RBAC.Wrapper>
      <PermissionsView
        addPermission={(value) =>
          setRequiredPermissions((prev) => [...prev, value])
        }
        removePermission={(per) =>
          setRequiredPermissions((prev) => prev.filter((r) => r !== per))
        }
        permissions={requiredPermissions}
        label="Required Permieeions for component"
      />
      <RBACWrapper
        requiredPermissions={requiredPermissions}
        blockedComponentPropsOverride={{ style: { background: 'green' } }}
      >
        <>
          <div style={{ width: '100px', height: '100px', background: 'red' }}>
            hi
          </div>
        </>
      </RBACWrapper>
    </div>
  );
};
