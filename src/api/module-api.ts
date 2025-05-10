import { ModuleApiResponse } from "../types/roles.type";
import * as BaseApi from "./base-api";

class ModuleApiService {
private moduleBaseUrl = (action: string) => action;

  public async getAllModules(): Promise<ModuleApiResponse|undefined> {
    return BaseApi._get({
      api: this.moduleBaseUrl("/modules/"),
      data: null,
    });
  }

}

const ModuleApi = new ModuleApiService();
export default ModuleApi;

