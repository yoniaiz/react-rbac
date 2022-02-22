import React, { useState } from "react";
import ReactDOM from "react-dom";
import { RBACComponent, RBACContextProvider } from "../../build/index.es";
import Component from "./Component";

const Test = () => {
  return <div>test</div>;
};
const App = () => {
  const [state, setState] = useState(0);

  return (
    <RBACContextProvider
      roles={["admin"]}
      permissions={["get_all", "delete_all"]}
    >
      <RBACComponent requiredRoles={["admin"]}>
        <div style={{ width: "100px", height: "100px", background: "red" }}>
          hi
        </div>
      </RBACComponent>
      <RBACComponent requiredPermissions={["get_all"]}>
        <Test />
      </RBACComponent>
      <button onClick={() => setState((prev) => prev + 1)}>state</button>
      <Component />
    </RBACContextProvider>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
