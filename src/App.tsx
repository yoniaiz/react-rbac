import React, { useState } from "react";
import ReactDOM from "react-dom";
import { PermissionsView } from "./components/PermissionsView";
import { ComponentWithRoles } from "./components/ComponentWithRoles";
import { RBACContextProvider } from "./RBACContext";
import { ComponentWithPermissions } from "./components/ComponentWithPermissions";
import { useRBACContext } from ".";

const RolesAndPermissionsInContext = () => {
  const helper = (title, obj) => {
    return (
      <div style={{ margin: "8px" }}>
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
      <div style={{ display: "flex" }}>
        {helper("existing permissions", existingPermissions)}
        {helper("added permissions", addedPermissions)}
        {helper("blocked permissions", blockedPermissions)}
      </div>
      <div style={{ display: "flex" }}>
        {helper("existing roles", existingRoles)}
        {helper("added roles", addedRoles)}
        {helper("blocked roles", blockedRoles)}
      </div>
    </div>
  );
};

const App = () => {
  const [roles, setRoles] = useState<string[]>(["admin"]);
  const [permissions, setPermissions] = useState<string[]>([
    "get_all",
    "delete_all",
  ]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "80vw",
        margin: "auto",
        minWidth: "320px",
      }}
    >
      <div>
        <h2>Manually set roles and permissions</h2>
        <PermissionsView
          addPermission={(value) => setRoles((prev) => [...prev, value])}
          removePermission={(per) =>
            setRoles((prev) => prev.filter((r) => r !== per))
          }
          permissions={roles}
          label="Roles"
        />
        <PermissionsView
          addPermission={(value) => setPermissions((prev) => [...prev, value])}
          removePermission={(per) =>
            setPermissions((prev) => prev.filter((p) => p !== per))
          }
          permissions={permissions}
          label="Permissions"
        />
      </div>
      <RBACContextProvider roles={roles} permissions={permissions}>
        <div>
          <ComponentWithRoles />
          <ComponentWithPermissions />
          <RolesAndPermissionsInContext />
        </div>
      </RBACContextProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
