import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { PermissionsView } from './components/PermissionsView';
import { ComponentWithRoles } from './components/ComponentWithRoles';
import { ComponentWithPermissions } from './components/ComponentWithPermissions';
import { useRBACContext } from '..';
import ComponentWithHOC from './components/ComponentWithHOC';
import { Roles, RBAC, Permissions } from './RBAC';

const RolesAndPermissionsInContext = () => {
  const helper = (title, obj) => {
    return (
      <div style={{ margin: '8px' }}>
        <p>{title}</p>
        {JSON.stringify(obj, null, 2)}
      </div>
    );
  };
  const {
    addedPermissions,
    addedRoles,
    existingPermissions,
    existingRoles,
    blockedPermissions,
    blockedRoles,
  } = useRBACContext();
  return (
    <div>
      <div style={{ display: 'flex' }}>
        {helper('existing permissions', existingPermissions)}
        {helper('added permissions', addedPermissions)}
        {helper('blocked permissions', blockedPermissions)}
      </div>
      <div style={{ display: 'flex' }}>
        {helper('existing roles', existingRoles)}
        {helper('added roles', addedRoles)}
        {helper('blocked roles', blockedRoles)}
      </div>
    </div>
  );
};

const App = () => {
  const [roles, setRoles] = useState<Roles[]>(['admin']);
  const [permissions, setPermissions] = useState<Permissions[]>(['allow_auth']);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '80vw',
        margin: 'auto',
        minWidth: '320px',
      }}
    >
      <div>
        <h2>Manually set roles and permissions</h2>
        <PermissionsView
          addPermission={(value: Roles) => setRoles((prev) => [...prev, value])}
          removePermission={(per) =>
            setRoles((prev) => prev.filter((r) => r !== per))
          }
          permissions={roles}
          label="Roles"
        />
        <PermissionsView
          addPermission={(value: Permissions) =>
            setPermissions((prev) => [...prev, value])
          }
          removePermission={(per) =>
            setPermissions((prev) => prev.filter((p) => p !== per))
          }
          permissions={permissions}
          label="Permissions"
        />
      </div>
      <RBAC.Provider roles={roles} permissions={permissions}>
        {({ addRoles, addPermissions, addedRoles, addedPermissions }) => {
          return (
            <>
              <div>
                <h2>hooks</h2>
                <RBAC.Component
                  requiredRoles={['admin']}
                  requiredPermissions={['get_all']}
                >
                  <div>hi</div>
                </RBAC.Component>
                <RBAC.Component requiredRoles={['admin']}>
                  <div>hi</div>
                </RBAC.Component>
                <div>
                  <button
                    onClick={() =>
                      addRoles([`role-${Object.keys(addedRoles).length + 1}`])
                    }
                  >
                    add roles
                  </button>
                  <button
                    onClick={() =>
                      addPermissions([
                        `permissions-${
                          Object.keys(addedPermissions).length + 1
                        }`,
                      ])
                    }
                  >
                    add permissions
                  </button>
                </div>
              </div>
              <div>
                <ComponentWithRoles />
                <ComponentWithPermissions />
                <RolesAndPermissionsInContext />
                <ComponentWithHOC />
              </div>
            </>
          );
        }}
      </RBAC.Provider>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
