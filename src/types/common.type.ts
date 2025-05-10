export interface IPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }


export interface IResponseMessage {
  message: string;
}

export interface IMetaData {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  currentRecords?: number;
}

export interface IUpdatePasswordPayload {
  oldPassword: string | undefined;
  newPassword: string | undefined;
}


export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Other = "OTHER",
}

export enum PreferredGender {
  Male = "MALE",
  Female = "FEMALE",
  Everyone = "EVERYONE",
}

export enum Role {
  Entertainer = "ENTERTAINER",
  Customer = "CUSTOMER",
}

export interface IChangePasswordState {
  oldPassword: string;
  newPassword: string;
}

export interface IPagination {
  page: number;
  limit: number;
  roles?: string | null;
}

export interface IHiylloTeamMember {
  _id: string;
  username: string;
  // hiylloID: string;
  email: string;
  // isFederationAdmin: boolean;
}
