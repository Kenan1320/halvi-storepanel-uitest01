// types/role.type.ts

export type PermissionAction = "LIST" | "UPDATE" | "DELETE" | "CREATE";

export interface Module {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleApiResponse {
  message: string;
  data: Module[];
}

export interface RolePermission {
  id: number;
  roleId: number;
  moduleId: number;
  permissions: PermissionAction[];
  createdAt: string;
  updatedAt: string;
  module: Module;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  permissions: RolePermission[];
}

// For API responses
export interface RoleResponse {
  message: string;
  data: Role;
}

export interface RolesResponse {
  message: string;
  data: Role[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

// For creating/updating roles
export interface CreateRolePayload {
  name: string;
  description: string;
  permissions: {
    moduleId: number;
    permissions: PermissionAction[];
  }[];
}

export interface UpdateRolePayload extends Partial<CreateRolePayload> {
  id: number;
}

// For form handling
export interface RoleFormValues {
  name: string;
  description: string;
  permissions: {
    moduleId: number;
    permissions: PermissionAction[];
  }[];
}

// For permission management in UI
export interface ModulePermission {
  moduleId: number;
  moduleName: string;
  permissionActions: Record<PermissionAction, boolean>;
}