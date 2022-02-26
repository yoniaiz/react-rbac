import React from 'react';
import { RBACWrapper } from '../RBACWrapper';
import { render, screen } from '@testing-library/react';
import { RBACProvider } from '../RBACContext';

describe('RBAC Component', () => {
  it('Should throw error when component not wrapped with RBAC context', () => {
    const s = jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
    expect(() =>
      render(
        <RBACWrapper>
          <div>hi</div>
        </RBACWrapper>
      )
    ).toThrow('Please connect RBAC context');
    s.mockRestore();
  });

  it('Should display component when all roles valid', () => {
    render(
      <RBACProvider roles={['guest', 'admin']}>
        <RBACWrapper requiredRoles={['admin']}>
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('Should display component when all permissions valid', () => {
    render(
      <RBACProvider permissions={['something', 'get_all_credits']}>
        <RBACWrapper requiredPermissions={['get_all_credits']}>
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('Should hide component when roles not valid', () => {
    render(
      <RBACProvider roles={['admin']}>
        <RBACWrapper requiredRoles={['admin', 'guest']}>
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.queryByText('test')).toBeNull();
  });

  it('Should hide component when permissions not valid', () => {
    render(
      <RBACProvider permissions={['get_all_credits']}>
        <RBACWrapper
          requiredPermissions={['get_all_credits', 'delete_all_credits']}
        >
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.queryByText('test')).toBeNull();
  });

  it('Should replace component', () => {
    render(
      <RBACProvider permissions={['get_all_credits']}>
        <RBACWrapper
          requiredPermissions={['get_all_credits', 'delete_all_credits']}
          fallback={<div>fallback</div>}
        >
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('Should change styled to blocked component', () => {
    render(
      <RBACProvider permissions={['get_all_credits']}>
        <RBACWrapper
          requiredPermissions={['get_all_credits', 'delete_all_credits']}
          hideWhenBlocked={false}
          blockedComponentPropsOverride={{ style: { color: 'green' } }}
        >
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('test')).toHaveStyle({ color: 'green' });
  });

  it('Children should be able to receive state', () => {
    render(
      <RBACProvider permissions={['get_all_credits']}>
        <RBACWrapper
          requiredPermissions={['get_all_credits', 'delete_all_credits']}
        >
          {({ hasRequiredPermissions }) => (
            <div>{hasRequiredPermissions ? 'test' : 'blocked'}</div>
          )}
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('blocked')).toBeInTheDocument();
  });

  it('Should display component when oneOf roles satisfied', () => {
    render(
      <RBACProvider roles={['guest']}>
        <RBACWrapper requiredRoles={['admin', 'guest']} oneOf>
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('Should display component when oneOf permissions satisfied', () => {
    render(
      <RBACProvider permissions={['get_all']}>
        <RBACWrapper requiredPermissions={['delete_all', 'get_all']} oneOf>
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('On of for roles + permissions', () => {
    render(
      <RBACProvider permissions={['get_all']} roles={['admin']}>
        <RBACWrapper
          requiredPermissions={['delete_all', 'get_all']}
          requiredRoles={['owner', 'admin']}
          oneOf
        >
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it("Has permissions but don't have roles ", () => {
    render(
      <RBACProvider permissions={['get_all']} roles={['admin']}>
        <RBACWrapper
          requiredPermissions={['delete_all', 'get_all']}
          requiredRoles={['owner']}
          oneOf
        >
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.queryByText('test')).toBeNull();
  });
  it("Has roles but don't have permissions ", () => {
    render(
      <RBACProvider permissions={['get_all']} roles={['admin']}>
        <RBACWrapper
          requiredPermissions={['delete_all']}
          requiredRoles={['admin']}
          oneOf
        >
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.queryByText('test')).toBeNull();
  });

  it('Required permissions on roles ', () => {
    render(
      <RBACProvider
        permissions={['delete_all', 'get_all']}
        roles={['admin', 'owner']}
      >
        <RBACWrapper
          requiredPermissions={['delete_all', 'get_all']}
          requiredRoles={['admin', 'owner']}
        >
          <div>test</div>
        </RBACWrapper>
      </RBACProvider>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
