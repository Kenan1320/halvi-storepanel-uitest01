import {IDeleteResponse, IRoleResponse, IRoles, IRoleUpdateData, IUpdateRoleResponse, Role, RoleType} from "../types/roles.type"
import { IUserPaginationParams } from "../types/user.type";
import * as BaseApi from "./base-api";

class RoleApiService {
  private url = (action: string) => "roles"+action;

   public async create(body: RoleType): Promise<Role> {
    return BaseApi._post({
      api: this.url("/"),
      data: body,
    });
  }

  public async getAll(): Promise<IRoles> {
    return BaseApi._get({
      api: this.url("/"),
      data: null,
    });
  }

  public async getRolesPagination(paginationParam: IUserPaginationParams): Promise<IRoles> {
    return BaseApi._get({
      api: this.url("/pagination"),
      data: paginationParam,
    });
  }

  public async get(id: string): Promise<IRoleResponse> {
    return BaseApi._get({
      api: this.url(`/${id}`),
      data: null  
    });
  }



  public async update(id: string, body: IRoleUpdateData): Promise<IUpdateRoleResponse> {
    return BaseApi._patch({
      api: this.url(`/${id}`),
      data: body,
    });
}

  public async delete(id: string): Promise<IDeleteResponse> {
    return BaseApi._delete({
      api: this.url(`/${id}`),
      data: null,
    });
  }
}

const RoleApi = new RoleApiService();
export default RoleApi;
