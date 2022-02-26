import React from 'react';
import { render } from '@testing-library/react';
import { RBACProvider } from '..';
import ComponentWithHOC from '../sandbox/components/ComponentWithHOC';

describe('withRBAC', () => {
  it('Should display component when permissions valid', () => {
    render(
      <RBACProvider permissions={['delete_all']}>
        <ComponentWithHOC />
      </RBACProvider>
    );
  });
  it('Should hide component when permissions not valid', () => {
    render(
      <RBACProvider permissions={[]}>
        <ComponentWithHOC />
      </RBACProvider>
    );
  });
});
