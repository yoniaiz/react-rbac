import React, { createContext, useContext } from "react";

interface State {
  existingRolesNorm: Record<string, string>;
  existingPermissionsNorm: Record<string, string>;
  existingPermissions: string[];
  existingRoles: string[];
  blockedRoles: Record<string, string>;
  addedRoles: Record<string, string>;
  blockedPermissions: Record<string, string>;
  addedPermissions: Record<string, string>;
}

interface ContextProps extends State {
  addPermissions: (added: string[]) => void;
  blockPermissions: (blocked: string[]) => void;
  addRoles: (added: string[]) => void;
  blockRoles: (blocked: string[]) => void;
  resetRoles: (blocked: string[]) => void;
  resetPermissions: (blocked: string[]) => void;
}

export const RBACContext = createContext<ContextProps>({
  existingRolesNorm: {},
  existingPermissionsNorm: {},
  existingPermissions: [],
  existingRoles: [],
  addedPermissions: {},
  addedRoles: {},
  blockedRoles: {},
  blockedPermissions: {},
  addPermissions: null,
  blockPermissions: null,
  addRoles: null,
  blockRoles: null,
  resetRoles: null,
  resetPermissions: null,
});

interface ProviderProps {
  roles: string[];
  permissions: string[];
  children: React.ReactNode;
}

function normalizeArr(arr) {
  if (!arr?.length) return {};

  const norm = {};
  for (const item of arr) {
    norm[item] = item;
  }

  return { ...norm };
}

function omit(obj: object, key: string) {
  delete obj[key];
}
export class RBACContextProvider extends React.Component<ProviderProps, State> {
  constructor(props: ProviderProps) {
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
    nextProps: Readonly<ProviderProps>,
    nextState: Readonly<State>
  ) {
    if (
      nextProps.permissions?.length &&
      !nextProps.permissions.every((nextRole) =>
        this.props.permissions.includes(nextRole)
      )
    ) {
      return true;
    }

    if (
      nextProps.roles?.length &&
      !nextProps.roles.every((nextRole) => this.props.roles.includes(nextRole))
    ) {
      return true;
    }

    if (
      !this.state.existingPermissions?.length &&
      nextProps.permissions?.length
    ) {
      return true;
    }

    if (!this.state.existingRoles?.length && nextProps.roles?.length) {
      return true;
    }

    if (
      !Object.values(nextState.blockedRoles).every(
        (blockedRole) => !!this.state.blockedRoles[blockedRole]
      )
    ) {
      return true;
    }

    if (
      !Object.values(nextState.blockedPermissions).every(
        (blockedPermission) =>
          !!this.state.blockedPermissions[blockedPermission]
      )
    ) {
      return true;
    }

    if (
      !Object.values(nextState.addedPermissions).every(
        (addedPermission) => !!this.state.addedPermissions[addedPermission]
      )
    ) {
      return true;
    }
    if (
      !Object.values(nextState.addedRoles).every(
        (addedRole) => !!this.state.addedRoles[addedRole]
      )
    ) {
      return true;
    }

    if (
      !Object.values(nextState.addedRoles).length &&
      Object.values(this.state.addedRoles).length
    ) {
      return true;
    }

    if (
      !Object.values(nextState.blockedRoles).length &&
      Object.values(this.state.blockedRoles).length
    ) {
      return true;
    }

    if (
      !Object.values(nextState.blockedPermissions).length &&
      Object.values(this.state.blockedPermissions).length
    ) {
      return true;
    }

    if (
      !Object.values(nextState.addedPermissions).length &&
      Object.values(this.state.addedPermissions).length
    ) {
      return true;
    }

    return false;
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

  render() {
    return (
      <RBACContext.Provider
        value={{
          ...this.state,
          blockPermissions: this.blockPermissions,
          addPermissions: this.addPermissions,
          blockRoles: this.blockRoles,
          addRoles: this.addRoles,
          resetRoles: this.resetRoles,
          resetPermissions: this.resetPermissions,
        }}
      >
        {this.props.children}
      </RBACContext.Provider>
    );
  }
}

export const useRBACContext = () => useContext(RBACContext);
