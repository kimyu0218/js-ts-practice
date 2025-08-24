import { AccountAttributes } from '../models/account';

export type CreateAccountDto = Pick<AccountAttributes, 'password' | 'memberId'>;
export type LoginRequestDto = Pick<AccountAttributes, 'id' | 'password'>;
