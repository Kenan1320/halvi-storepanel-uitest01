import {
  Role,
  RoleResponse,
  RolesResponse,
  CreateRolePayload,
  UpdateRolePayload,
  PermissionAction
} from "../types/roles.type";
import * as BaseApi from "./base-api";

class RoleApiService {
  private url = (action: string) => `/vendors/roles${action}`;

  public async create(body: CreateRolePayload): Promise<Role | undefined> {
    return BaseApi._post<Role>({
      api: this.url("/"),
      data: body,
    });
  }

  public async getAll(): Promise<RolesResponse | undefined> {
    return BaseApi._get<RolesResponse>({
      api: this.url("/"),
      data: null,
    });
  }

  public async getRolesPagination(params: {
    page: number;
    limit: number;
  }): Promise<RolesResponse | undefined> {
    return BaseApi._get<RolesResponse>({
      api: this.url("/pagination"),
      data: params,
    });
  }

  public async get(id: number): Promise<RoleResponse | undefined> {
    return BaseApi._get<RoleResponse>({
      api: this.url(`/${id}`),
      data: null,
    });
  }

  public async update(
    id: number,
    body: UpdateRolePayload
  ): Promise<RoleResponse | undefined> {
    return BaseApi._patch<RoleResponse>({
      api: this.url(`/${id}`),
      data: body,
    });
  }

  public async delete(id: number): Promise<{ message: string } | undefined> {
    return BaseApi._delete<{ message: string }>({
      api: this.url(`/${id}`),
      data: null,
    });
  }
}

const RoleApi = new RoleApiService();
export default RoleApi;