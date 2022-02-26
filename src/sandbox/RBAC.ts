import { RBACFactory } from '../RBACFactory';

export type Roles = 'admin' | 'owner';
export type Permissions = 'get_all' | 'allow_auth';

export const { RBAC } = RBACFactory<Roles, Permissions>();
