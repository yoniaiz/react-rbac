import React, { createContext, useContext } from "react";
import {
  RBACContextProps,
  RBACContextState,
  RBACProviderProps,
} from "./RBAC.types";
import { normalizeArr, omit, shouldUpdateRBAC } from "./RBAC.utils";

export const RBACContext = createContext<RBACContextProps>(null);

export class RBACContextProvider extends React.Component<
  RBACProviderProps,
  RBACContextState
> {
  constructor(props: RBACProviderProps) {
    super(props);
    this.state = {
      existingRolesNorm: {},
      existingPermissionsNorm: {},
      existingPermissions: [],
      existingRoles: [],
      blockedRoles: {},
      blockedPermissions: {},
      addedRoles: {},
      addedPermissions: {},
    };
  }

  updateState = (permissions: string[], roles: string[]) => {
    this.setState((prev) => ({
      ...prev,
      existingPermissions: permissions,
      existingRoles: roles,
      existingRolesNorm: normalizeArr(roles),
      existingPermissionsNorm: normalizeArr(permissions),
    }));
  };
  componentDidMount(): void {
    this.updateState(this.props.permissions, this.props.roles);
  }

  shouldComponentUpdate(
    nextProps: Readonly<RBACProviderProps>,
    nextState: Readonly<RBACContextState>
  ) {
    return shouldUpdateRBAC(nextProps, nextState, this.props, this.state);
  }

  componentDidUpdate(): void {
    this.updateState(this.props.permissions, this.props.roles);
  }

  blockPermissions = (blocked: string[]) => {
    const addedPermissions = { ...this.state.addedPermissions };
    blocked.forEach((block) => {
      omit(addedPermissions, block);
    });

    this.setState((prev) => ({
      ...prev,
      blockedPermissions: {
        ...prev.blockedPermissions,
        ...normalizeArr(blocked),
      },
      addedPermissions,
    }));
  };

  addPermissions = (added: string[]) => {
    const filteredAdded = added.filter(
      (add) =>
        !this.state.existingPermissionsNorm[add] ||
        this.state.blockedPermissions[add]
    );
    if (!filteredAdded.length) return;

    const blockedPermissions = { ...this.state.blockedPermissions };
    filteredAdded.forEach((add) => {
      omit(blockedPermissions, add);
    });

    this.setState((prev) => ({
      ...prev,
      addedPermissions: {
        ...prev.addedPermissions,
        ...normalizeArr(filteredAdded),
      },
      blockedPermissions: blockedPermissions,
    }));
  };

  blockRoles = (blocked: string[]) => {
    const addedRoles = { ...this.state.addedRoles };
    blocked.forEach((block) => {
      omit(addedRoles, block);
    });

    this.setState((prev) => ({
      ...prev,
      blockedRoles: { ...prev.blockedRoles, ...normalizeArr(blocked) },
      addedRoles,
    }));
  };

  addRoles = (added: string[]) => {
    const filteredAdded = added.filter(
      (add) =>
        !this.state.existingRolesNorm[add] || this.state.blockedRoles[add]
    );
    if (!filteredAdded.length) return;

    const blockedRoles = { ...this.state.blockedRoles };

    filteredAdded.forEach((add) => {
      omit(blockedRoles, add);
    });

    this.setState((prev) => ({
      ...prev,
      addedRoles: { ...prev.addedRoles, ...normalizeArr(filteredAdded) },
      blockedRoles,
    }));
  };

  resetRoles = () => {
    this.setState((prev) => ({ ...prev, blockedRoles: {}, addedRoles: {} }));
  };

  resetPermissions = () => {
    this.setState((prev) => ({
      ...prev,
      blockedPermissions: {},
      addedPermissions: {},
    }));
  };

  resetAll = () => {
    this.resetPermissions();
    this.resetRoles();
  };

  render() {
    const sharedState: RBACContextProps = {
      ...this.state,
      blockPermissions: this.blockPermissions,
      addPermissions: this.addPermissions,
      blockRoles: this.blockRoles,
      addRoles: this.addRoles,
      resetRoles: this.resetRoles,
      resetPermissions: this.resetPermissions,
      resetAll: this.resetAll,
    };
    return (
      <RBACContext.Provider value={sharedState}>
        {typeof this.props.children === "function"
          ? this.props.children(sharedState)
          : this.props.children}
      </RBACContext.Provider>
    );
  }
}
