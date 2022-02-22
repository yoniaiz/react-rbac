import React from "react";
import { useRBACContext, withRBAC } from "../../build/index.es";

const Button = () => {
  const props = useRBACContext();

  return (
    <>
      <button onClick={() => props.blockRoles(["admin"])}>a</button>
      <button onClick={() => props.addRoles(["admin"])}>b</button>
      <button onClick={() => props.resetRoles()}>reset</button>
      <button onClick={() => props.addPermissions(["get_all"])}>
        permissions
      </button>
      <button onClick={() => props.blockPermissions(["get_all"])}>
        remove permissions
      </button>
      <button onClick={() => props.resetPermissions()}>
        reset permissions
      </button>
    </>
  );
};
class Component extends React.Component {
  render() {
    return (
      <div {...this.props}>
        <Button />
      </div>
    );
  }
}

export default withRBAC(Button, {
  requiredRoles: ["admin"],
  hideWhenBlocked: false,
  blockedComponentPropsOverride: {
    style: { backgroundColor: "yellow", height: "100px" },
  },
});
