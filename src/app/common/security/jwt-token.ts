import { User } from '@common/user';

export interface JwtToken {
  token: string;
  userDTO: User;
}
