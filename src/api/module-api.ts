import { Module, ModuleApiResponse } from "../types/roles.type";
import * as BaseApi from "./base-api";

class ModuleApiService {
  private moduleBaseUrl = (action: string) => `/vendors/modules${action}`;

  public async getAllModules(): Promise<ModuleApiResponse | undefined> {
    return BaseApi._get<ModuleApiResponse>({
      api: this.moduleBaseUrl("/"),
      data: null,
    });
  }
}

const ModuleApi = new ModuleApiService();
export default ModuleApi;