# React Simple RBAC

Library consists of Context, Component, HOC and hooks to handle cross app Role-based access control ([RBAC])

## **Table of Contents**

- [Installation](#installation)
- [Usage](#installation)
- [RBACProvider](#RBACProvider)
- [RBACWrapper](#RBACWrapper)
- [withRBAC](#withRBAC)
- [useRBACContext](#useRBACContext)
- [useHasRoles](#useHasRoles)
- [useHasPermissions](#useHasPermissions)
- [useGetRolesState](#useGetRolesState)
- [useGetPermissionsState](#useGetPermissionsState)
- [RBACFactory](#RBACFactory)

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and

should be installed as one of your project's `dependencies`:

```

npm install --save react-simple-rbac

```

> This package also depends on `react`. Please make sure you have it installed

> as well.

## Usage

Simple example of basic usage

```JSX
const roles = ['admin'];
const permissions = ['get_all_credits', 'delete_all_credits'];

const Component = () => {
return <h2>only user with certain permissions can see me!</h2>;
};

const App = () => {
  return (
    <RBACProvider roles={roles} permissions={permissions}>
      {/* Will be visible */}
      <RBACWrapper requiredPermissions={['get_all_credits']}>
        <Component />
      </RBACWrapper>
      {/* Will be hidden */}
      <RBACWrapper requiredPermissions={['permission_that_not_exists']}>
        <Component />
      </RBACWrapper>
    </RBACProvider>
  );
};
```

Here you can see that we wrap the app with the [RBACProvider](#RBACProvider) that has only the role of **"admin"** and
permissions **['get_all_credits', 'delete_all_credits']**.
The first component will be visible because it satisfies the existing permissions, but on other hand the second
component will be hidden.
This is a basic example and you have much more flexibility with the components and hooks.

<h1 id="RBACProvider">RBACProvider</h1>

**Props to pass**

**children**

> React.ReactNode | ((props) => React.ReactNode) | required

Can pass the children as regular child or as function that will get access to all context props and will return a JSX
element

> **permissions**
> string[] - not required

The permissions of the entire app, can be modified during the use of the application, recommended to pass as memoized
array

**roles**

> string[] - not required

The roles of the entire app, can be modified during the use of the application, recommended to pass as memoized array

---

**The context provides the following props**

**existingPermissions**

> string array

The permissions array that was provided to the RBACProvider

**existingRoles**

> string array

The roles array that was provided to the RBACProvider

**existingRolesNorm**

> object

The roles array that was provided to the RBACProvider - normalized to object when the key and value is the Roles - for
example

```javascript
const existingRoles = ['admin'];
const existingRolesNorm = { admin: 'admin' };
```

The main reason for that is for the ease to find and existing role

**existingPermissionsNorm**

> object

The permissions array that was provided to the RBACProvider - normalized to object when the key and value is the Roles -
for example

```javascript
const existingPermissions = ['get_all_credits', 'delete_all_credits'];
const existingPermissionsNorm = {
  get_all_credits: 'get_all_credits',
  delete_all_credits: 'delete_all_credits',
};
```

The main reason for that is for the ease to find and existing permission

**blockedRoles**

> object

A manually set list of roles that are blocked, ( set with `blockRoles` func )

**addedRoles**

> object

A manually set list of roles that are added, ( set with `addRoles` func )

**blockedPermissions**

> object

A manually set list of permissions that are blocked, ( set with `blockPermissions` func )

**addedPermissions**

> object

A manually set list of permissions that are added, ( set with `addPermissions` func )

**addPermissions**

> function ( permissionsToAdd: string[] )

Can manually add permissions to the state -
**If** you add permissions that is currently in the blocked permissions object, it will be removed from the blocked
list.
for example:

```javascript
console.log(blockedPermissions);
// { get_all_credits : 'get_all_credits', delete_all_credits: 'delete_all_credits' }
console.log(addedPermissions); // {};
addPermissions(['get_all_credits']);

console.log(blockedPermissions); // { delete_all_credits: 'delete_all_credits' }
console.log(addedPermissions); // { get_all_credits: 'get_all_credits' }
```

**blockPermissions**

> function ( permissionsToBlock: string[] )

Can manually block permissions from the state
**If** you block permissions that is currently in the added permissions list, it will be removed the permission from the
added list.
for example:

```javascript
console.log(addedPermissions);
// { get_all_credits: 'get_all_credits', delete_all_credits: 'delete_all_credits' }
console.log(blockedPermissions); // {};
blockPermissions(['get_all_credits']);

console.log(addedPermissions); // { delete_all_credits: 'delete_all_credits' }
console.log(blockedPermissions); // { get_all_credits: 'get_all_credits' }
```

addRoles

> function ( rolesToAdd: string[] )

Can manually add roles to the state -
**If** you add roles that is currently in the blocked roles list, it will be removed from the blocked list.
for example:

```javascript
console.log(blockedRoles);
// { owner : 'owner' }
console.log(addedPermissions); // {};
addPermissions(['owner']);

console.log(blockedPermissions); // {}
console.log(addedPermissions); // { owner: 'owner' }
```

**blockRoles**

> function ( rolesToBlock: string[] )

Can manually block roles to the state -
**If** you block roles that are currently in the added roles list, it will be removed from the added list.
for example:

```javascript
console.log(blockedRoles);
// {}
console.log(addedPermissions); // { owner: 'owner' };
blockPermissions(['owner']);

console.log(blockedPermissions); // { owner: 'owner' }
console.log(addedPermissions); // {}
```

**resetRoles**

> function ( )

Will reset all manually added or blocked roles.

**resetPermissions**

> function ( )

Will reset all manually added or blocked permissions.

**resetAll**

> function ( )

Will reset all manually added or blocked permissions and roles.

---

<h1 id="RBACWrapper">RBACWrapper</h1>

Component wrapper for applying RBAC Roles

**Props to pass**

**children**

> React.ReactNode | (({ hasRequiredPermissions, hasRequiredRoles }) => React.ReactNode) | required

The children that will be wrapped with the RBAC roles, the children can also be a function that will receive

hasRequiredPermissions, hasRequiredRoles

When you will pass the children as a function the component will not be hidden when there permissions or roles are
blocked, you can do manually the needed implementation
example:

```JSX
<RBACWrapper requiredPermissions={['get_all_credits']}>
  {({ hasRequiredRoles, hasRequiredPermissions }) => {
    if (!hasRequiredRoles) {
      return <div>You dont have the required roles :[</div>;
    }
    if (!hasRequiredPermissions) {
      return <div>You dont have the required permissions :[</div>;
    }
    return <div>hi</div>;
  }}
</RBACWrapper>
```

**requiredRoles**

> string[] | optional

The required roles for the component

**requiredPermissions**

> string[] | optional

The required permissions for the component

**fallback**

> ReactNode

In case the permission is blocked and you want to return other element instead of hiding the component
example:

```JSX
<RBACWrapper requiredPermissions={['get_all_credits']} fallback={<div>Very sad</div>}>
  <div>So happy!</div>
</RBACWrapper>
```

**hideWhenBlocked**

> boolean - default true

By default the flag is true, and when the permissions or roles not satisfy the component will be hidden, by setting the
flag to false the component will not be hidden, usually will be combined with \*blockedComponentPropsOverride
Also the component will receive css class `'rbac-block'` to enable styling the component

**blockedComponentPropsOverride**
Will override the props passed to the component
example:

```JSX
<RBACWrapper
  requiredPermissions={['get_all_credits']}
  hideWhenBlocked={false}
  blockedComponentPropsOverride={{
    style: { color: 'red' },
    onClick: () => {
      console.log('IM BLOCKED :(');
    },
  }}
>
  <button
    type="button"
    onClick={() => {
      console.log('HELLO');
    }}
  >
    click
  </button>
</RBACWrapper>;
```

Note that if you pass a Component as children and blockedComponentPropsOverride
will have props inside that are not part of the props of the component you will need to get them inside the component

```JSX
const Button = ({ onClick, children, ...propsFromRBACOverride }) => {
  return (
    <button type="button" onClick={onClick} {...propsFromRBACOverride}>
      {children}
    </button>
  );
};
```

**oneOf**

> boolean - default false

By default, the flag is false. When you pass it as true, it means that it's enough for only one of the array items in
the roles and permissions to be found in the provided arrays ( if both roles and permissions passed to the RBACWrapper,
then each one of them needs to have at least one ).
example:

```JSX
const App = () => {
  return (
    <RBACProvider roles={['admin']}>
      <RBACWrapper requiredPermissions={['admin', 'owner' ]} oneOf>
        <div>Admin or owner can see me</div>
      </RBACWrapper>
    </RBACProvider>
  );
};
```

---

<h1 id="withRBAC">withRBAC</h1>

> function(ReactComponent, RBACWrapperProps)

withRBAC it's an HOC that the first parameter needs to be the component and second parameter is all the props that the
RBACWrapper can receive
example

```JSX
const ComponentWithHOC = () => {
  return (
    <div>
      <h2>HOC</h2>test
    </div>
  );
};

export default withRBAC(ComponentWithHOC, {
  requiredPermissions: ['delete_all'],
});
```

---

<h1 id="useRBACContext">useRBACContext</h1>

Hook that will return all props from the [RBACProvider](#RBACProvider)
Note - will throw error if the component is not child of the RBACProvider

<h1 id="useHasRoles">useHasRoles</h1>

> [hook] function( requiredRoles: string[], oneOf?: boolean (optional) ): boolean

Hook that In the first parameter will get the required roles that you want to check, second parameter is oneOf ( same as
in the RBACWrapper ) by default false,

The hook will return `true` if the Roles exists in the list of `existingRoles` or in the List of the `addedRoles` and
not exists in the `blockedRoles`

usage:

```JSX
const Component = () => {
  const hasRequiredRoles = useHasRoles(['admin']);
  if(hasRequiredRoles){
    return <div>hello!</div>
  }
  return </div>
};
```

<h1 id="useHasPermissions">useHasPermissions</h1>

> [hook] function( requiredPermissions: string[], oneOf?: boolean (optional) ): boolean

Hook that In the first parameter will get the required permissions that you want to check, second parameter is oneOf (
same as in the RBACWrapper ) by default false,

The hook will return `true` if the Permissions exists in the list of `existingPermissions` or in the List of the
`addedPermissions` and not exists in the `blockedPermissions`

usage:

```JSX
const Component = () => {
  const hasRequiredPermission = useHasPermissions(['get_all_credits','delete_all_credits']);
  if(hasRequiredPermission){
    return <div>hello!</div>
  }
  return </div>
};
```

<h1 id="useGetRolesState">useGetRolesState</h1>

> [hook] function( roles: string[] ): { existing: boolean, added: boolean, blocked: boolean }[]

Hook that In the first parameter will get the roles that you want to check and will return an array based on the roles
array of objects that each object will has the following properties

> existing: boolean

Indicates if the role exists or not ( in `existingRoles` or in `addedRoles` )

> added: boolean

Indicates if the role exists in the `addedRoles` list.

> blocked: boolean

Indicates if the role exists in the `blockedRoles` list.

<h1 id="useGetPermissionsState">useGetPermissionsState</h1>

> [hook] function( permissions: string[] ): { existing: boolean, added: boolean, blocked: boolean }[]

Hook that In the first parameter will get the permissions that you want to check and will return an array based on the
roles array of objects that each object will has the following properties

> existing: boolean

Indicates if the role exists or not ( in `existingPermissions` or in `addedPermissions` )

> added: boolean

Indicates if the role exists in the `addedPermissions` list.

> blocked: boolean

Indicates if the role exists in the `blockedPermissions` list.

<h1 id="RBACFactory">RBACFactory</h1>

For great [Typescript] experience you can use the RBACFactory function that can get generic union types of the
permissions and roles, and will return back all the components and hooks of the library with full autocomplete.
example

```JSX
// in RBAC.ts
import { RBACFactory } from 'react-simple-rbac'

export type Roles = 'admin' | 'owner';
export type Permissions = 'get_all' | 'allow_auth';

export const { RBAC } = RBACFactory<Roles, Permissions>();

  // in App.tsx
const App = () => {
  return (
    <RBAC.Provider roles={['admin']}>
      <Component />
    </RBAC.Provider>
  )
}

  // in Component.tsx
const Component = () => {
  const hasRequiredRoles = RBAC.useHasRoles(['admin']);
  return (
    <RBAC.Wrapper requiredRoles={['admin']}>
      <div>test</div>
    </RBAC.Wrapper />
  )
}
  ```

  ## LICENSE

  MIT

  [npm]: https://www.npmjs.com/
  [node]: https://nodejs.org
  [react]: https://facebook.github.io/react/
  [rbac]: https://en.wikipedia.org/wiki/Role-based_access_control
  [typescript]: https://www.typescriptlang.org/