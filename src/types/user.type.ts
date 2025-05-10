export interface IUser {
  _id: string;
  email: string;
  name: string;
  role?: string;
  location?: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  skills?: string[];
  language?: string;
  timezone?: string;
  theme?: string;
  codeTheme?: string;
  twoFactor?: boolean;
  notifications?: {
    email: boolean;
    push: boolean;
    projectUpdates: boolean;
    achievements: boolean;
  };
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface IUserQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  role?: string;
  skills?: string[];
} 