import { _post } from "./base-api";
import { RegisterData, LoginData, AuthResponse } from "../types/auth.type";

export class AuthApi {
  private static url = (action: string) => "/vendors/" + action;
  static async register(data: RegisterData): Promise<AuthResponse | undefined> {
    return _post<AuthResponse>({
      api: this.url("register"),
      data,
    });
  }

  static async login(data: LoginData): Promise<AuthResponse | undefined> {
    if (data.provider === "local" && data.credentials) {
      const res = await _post<AuthResponse>({
        api: this.url("login"),
        data:data.credentials,
      });

      return res;   
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}api/vendors/${data.provider}`;
    }
  }

  static async forgotPassword(email: string) {
    return await _post({
      api: this.url("forgot-password"),
      data: { email },
    });
  }

  static async verifyOtp(email: string, otp: string) {
    return await  _post({
      api: this.url("verify-otp"),
      data: { email, otp },
    });
  }

  static async resetPassword(email: string, otp: string, newPassword: string) {
    return  await _post({
      api: this.url("reset-password"),
      data: { email, otp, newPassword },
    });
  }
}
