import { PERMISSIONS } from "../utils/constants";
import { IMetaData } from "./common.type";

export interface IRolesNames {
  data: {
    _id: string;
    name: string;
    data: any;
  };
}

export type PermissionAction = typeof PERMISSIONS[number];


export interface ICreateRoles {
  name: string;
  description: string;
  permissions: {
    module: string;
    permissions: PermissionAction[];
  }[];
}


export type TModule = {
  _id: string;
  name: string;
  description: string;
  __v: number;
};

export type TPermission = {
  module: TModule;
  permissions: string[];
  _id: string;
};

export interface IRoles {
  message: string;
  data: Role[];
  pagination: IMetaData
}
export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: TPermission[];
  __v: number;
}

export interface commonResponse<T = any> {
  message: string;
  data: T;
}

export interface IDeleteResponse {
  message: string;
}

export interface Module {
  _id: string;
  name: string;
  description: string;
  __v: number;
}

export interface ModuleApiResponse {
  message: string;
  data: Module[];
}

export interface Permission {
  module: string;
  permissions: string[];
}

export interface RoleType {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface IModule {
  _id: string;
  name: string;
  description: string;
  __v: number;
}

export interface IPermission {
  module: IModule;
  permissions: ("GET" | "POST" | "DELETE" | "PUT" | "PATCH")[];
  _id: string;
}

export interface IRoleData {
  _id: string;
  name: string;
  description: string;
  permissions: IPermission[];
  __v: number;
}

export interface IRoleResponse {
  message: string;
  data: IRoleData;
}

export interface IUpdatedRolePermission {
  module: TModule;
  permissions: ("GET" | "POST" | "DELETE" | "PUT" | "PATCH")[];
  _id: string;
}

export interface IRoleUpdateData {
  _id: string;
  name: string;
  description: string;
  permissions: IUpdatedRolePermission[];
  __v: number;
}

export interface IUpdateRoleResponse {
  message: string;
  data: IRoleUpdateData;
}
