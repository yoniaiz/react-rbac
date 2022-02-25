import React, { useState } from "react";
import { PermissionsView } from "./PermissionsView";
import { RBACComponent } from "../RBACComponent";
import ComponentWithHoc from "./ComponentWithHOC";

export const ComponentWithPermissions = () => {
  const [requiredPermissions, setRequiredPermissions] = useState(["get_all"]);
  return (
    <div>
      <h2>RBAC Component</h2>
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
      <RBACComponent
        requiredPermissions={requiredPermissions}
        blockedComponentPropsOverride={{ style: { background: "green" } }}
      >
        <div style={{ width: "100px", height: "100px", background: "red" }}>
          hi
        </div>
      </RBACComponent>
    </div>
  );
};
