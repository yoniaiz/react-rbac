import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import * as hooks from '../RBAC.hooks';
import { RBACProvider } from '../RBACContext';

describe('RBAC hooks', () => {
  describe('useGetRolesState', () => {
    it('Should check if has roles', () => {
      const { result } = renderHook((props) => hooks.useGetRolesState(props), {
        initialProps: ['admin'],
        wrapper: ({ children }) => (
          <RBACProvider roles={['admin']}>{children}</RBACProvider>
        ),
      });

      act(() => {
        expect(result.current).toHaveLength(1);
        expect(result.current).toMatchInlineSnapshot(`
Array [
  Object {
    "added": false,
    "blocked": false,
    "existing": true,
  },
]
`);
      });
    });
  });

  describe('useGetPermissionsState', () => {
    it('Should check if has permissions', () => {
      const { result } = renderHook(
        (props) => hooks.useGetPermissionsState(props),
        {
          initialProps: ['add_credit'],
          wrapper: ({ children }) => (
            <RBACProvider permissions={['add_credit']}>{children}</RBACProvider>
          ),
        }
      );

      act(() => {
        expect(result.current).toHaveLength(1);
        expect(result.current).toMatchInlineSnapshot(`
Array [
  Object {
    "added": false,
    "blocked": false,
    "existing": true,
  },
]
`);
      });
    });
  });

  describe('Context functionality test', () => {
    it('Should be able to modify permissions', () => {
      const { result } = renderHook(hooks.useRBACContext, {
        initialProps: { permissions: ['add_credit'] },
        wrapper: ({ children, permissions }) => (
          <RBACProvider permissions={permissions}>{children}</RBACProvider>
        ),
      });

      act(() => {
        result.current.addPermissions(['something']);
      });

      expect(result.current.addedPermissions).toEqual({
        something: 'something',
      });

      act(() => {
        result.current.blockPermissions(['something']);
      });

      expect(result.current.addedPermissions).toEqual({});
      expect(result.current.blockedPermissions).toEqual({
        something: 'something',
      });
      act(() => {
        result.current.addPermissions(['something2']);
      });
      expect(result.current.addedPermissions).toEqual({
        something2: 'something2',
      });
      expect(result.current.blockedPermissions).toEqual({
        something: 'something',
      });
    });

    it('Should be able to modify roles', () => {
      const { result } = renderHook(hooks.useRBACContext, {
        initialProps: { permissions: ['add_credit'] },
        wrapper: ({ children, permissions }) => (
          <RBACProvider permissions={permissions}>{children}</RBACProvider>
        ),
      });

      act(() => {
        result.current.addRoles(['something']);
      });

      expect(result.current.addedRoles).toEqual({
        something: 'something',
      });

      act(() => {
        result.current.blockRoles(['something']);
      });

      expect(result.current.addedRoles).toEqual({});
      expect(result.current.blockedRoles).toEqual({
        something: 'something',
      });
      act(() => {
        result.current.addRoles(['something2']);
      });
      expect(result.current.addedRoles).toEqual({
        something2: 'something2',
      });
      expect(result.current.blockedRoles).toEqual({
        something: 'something',
      });
    });

    it('Should be able to reset all modifications', () => {
      const { result } = renderHook(hooks.useRBACContext, {
        initialProps: { permissions: ['add_credit'] },
        wrapper: ({ children, permissions }) => (
          <RBACProvider permissions={permissions}>{children}</RBACProvider>
        ),
      });

      act(() => {
        result.current.addRoles(['something']);
        result.current.addPermissions(['something']);
      });

      expect(result.current.addedRoles).toEqual({
        something: 'something',
      });
      expect(result.current.addedPermissions).toEqual({
        something: 'something',
      });

      act(() => {
        result.current.blockRoles(['something2']);
        result.current.blockPermissions(['something2']);
      });

      expect(result.current.blockedRoles).toEqual({
        something2: 'something2',
      });
      expect(result.current.blockedPermissions).toEqual({
        something2: 'something2',
      });

      act(() => {
        result.current.resetAll();
      });

      expect(result.current.addedRoles).toEqual({});
      expect(result.current.addedPermissions).toEqual({});
      expect(result.current.blockedRoles).toEqual({});
      expect(result.current.blockedPermissions).toEqual({});
    });
  });
});
