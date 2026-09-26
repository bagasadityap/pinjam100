import { PermissionResponse } from './pemission/permission.model';

export interface RoleRequest {
  roleName: string;
}

export interface RoleResponse {
  id: string;
  roleName: string;
  permissions: PermissionResponse[];
}
