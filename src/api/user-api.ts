import { _get, _post, _put, _delete } from "./base-api";
import { IUser, IUserQueryParams } from "../types/user.type";

export class UserApi {
  private static url = (action: string) => "/users/" + action;

  // Get all users with filtering and pagination
//   static async getAll(params?: IUserQueryParams) {
//     return _get<IUser[]>({
//       api: this.url(""),
//       data: params || {},
//     });
//   }

  // Get user by ID
  static async getById(id: string) {
    return _get<IUser>({
      api: this.url(id),
      data: {},
    });
  }

  // Get current user
  static async getCurrent() {
    return _get<IUser>({
      api: this.url("current"),
      data: {},
    });
  }
  // Create a new user
//   static async create(data: Partial<IUser>) {
//     return _post<IUser>({
//       api: this.url(""),
//       data,
//     });
//   }

  // Update user
  static async updateCurrent(data: Partial<IUser>) {
    return _put<IUser>({
      api: this.url("current"),
      data,
    });
  }

  // Delete user
//   static async deleteUser(id: string) {
//     return _delete({
//       api: this.url(id),
//       data: {},
//     });
//   }
} 