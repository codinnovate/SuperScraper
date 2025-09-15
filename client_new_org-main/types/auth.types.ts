export interface RegisterPayload {
  fullname: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  user_type: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
}
