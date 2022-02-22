import React from "react";
import ReactDOM from "react-dom";
import { RBACComponent, RBACContextProvider } from "../../build/index.es";
import Component from "./Component";

const App = () => (
  <RBACContextProvider roles={["admin"]}>
    <RBACComponent requiredRoles={["admin"]}>
      <div style={{ width: "100px", height: "100px", background: "red" }}>
        hi
      </div>
    </RBACComponent>

    <Component />
  </RBACContextProvider>
);

ReactDOM.render(<App />, document.querySelector("#root"));
