export interface IUserServiceCreateUser {
  email: string;
  password: string;
}

export interface IUserServiceCheckUserIsAdmin {
  user_id: string;
}
