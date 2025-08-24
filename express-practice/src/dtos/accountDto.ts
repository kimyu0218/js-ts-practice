import { AccountAttributes } from '../models/account';

export type LoginDto = Pick<AccountAttributes, 'id' | 'password'>;
