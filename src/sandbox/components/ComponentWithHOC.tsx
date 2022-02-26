import React from 'react';
import { withRBAC } from '../..';

const ComponentWithHOC = () => {
  return (
    <div>
      <h2>HOC</h2>
    </div>
  );
};

export default withRBAC(ComponentWithHOC, {
  requiredPermissions: ['delete_all'],
});
