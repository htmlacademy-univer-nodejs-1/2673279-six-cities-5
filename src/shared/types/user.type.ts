export type UserType = 'обычный' | 'pro';

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
  type: UserType;
};
