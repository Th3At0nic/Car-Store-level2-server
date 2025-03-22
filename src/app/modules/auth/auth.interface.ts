export type TLoginUser = {
  email: string;
  password: string;
};

export type TUserAuthData = {
  userEmail: string;
  role: string;
};

export type TChangePassData = {
  oldPassword: string;
  newPassword: string;
};
