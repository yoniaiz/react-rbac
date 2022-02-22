import React from "react";
import { withRBAC } from "../../build/index.es";

class Component extends React.Component {
  render() {
    return <div {...this.props}>Component</div>;
  }
}

export default withRBAC(Component, {
  requiredRoles: ["admin1"],
  hideWhenBlocked: false,
  blockedComponentPropsOverride: {
    style: { backgroundColor: "yellow", height: "100px" },
  },
});
