export type UserType = {
  _id: string;
  fullName: string;
  avatarUrl: string;
};

export type UserTypeFull = {
  _id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  imageCoverUrl: string;
  phoneNumber: string;
  deteOfBirth: string;
  images: string;
  isActivated: string;
};

export type AuthUserType = {
  accessToken: string;
  refreshToken: string;
  user: UserTypeFull;
};

export type RegisterUserType = {
  email: string;
  password: string;
  fullName: string;
};
