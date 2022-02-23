import React, { useState } from "react";

export const PermissionsView = ({
  permissions,
  label,
  addPermission,
  removePermission,
}) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <h3>{label}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addPermission(value);
          setValue("");
        }}
      >
        <label htmlFor={label} style={{ marginRight: "8px" }}>
          Add {label}
        </label>
        <input
          id={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="..."
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {permissions.map((permission) => (
          <li style={{ width: "150px", marginTop: "12px" }} key={permission}>
            {permission}{" "}
            <button
              style={{ float: "right" }}
              onClick={() => removePermission(permission)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
