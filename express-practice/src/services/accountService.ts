import { inject, injectable } from 'inversify';
import { Account } from '../models/account';
import { Member } from '../models/member';
import { MemberNotFoundError } from '../errors/memberError';
import { AccountNotFoundError, PasswordMismatchError } from '../errors/accountError';
import { LoginDto } from '../dtos/accountDto';
import { bcryptCompare } from '../utils/hash';

@injectable()
export class AccountService {
  constructor(
    @inject('AccountModel') private readonly account: typeof Account,
    @inject('MemberModel') private readonly member: typeof Member
  ) {}

  async create(memberId: number, password: string) {
    await this.member.findByPkOrFail(memberId);
    await this.account.create({ memberId, password });
  }

  async getById(id: number): Promise<Account> {
    const account = await this.account.findByPk(id);
    if (!account) {
      throw new AccountNotFoundError(id);
    }
    return account;
  }

  async getByMemberId(memberId: number): Promise<Account[]> {
    const member = await this.member.findOne({
      where: { id: memberId },
      include: [{ model: Account, as: 'accounts' }],
    });
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    return member.accounts ?? [];
  }

  async deleteByMemberId(memberId: number) {
    const member = await this.member.findOne({
      where: { id: memberId },
      include: [{ model: Account, as: 'accounts' }],
    });
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    if (member.accounts) {
      await Promise.all(member.accounts.map((account) => account.destroy()));
    }
  }

  async login({ id, password }: LoginDto) {
    const account = await this.getById(id);
    if (!bcryptCompare(password, account.password)) {
      throw new PasswordMismatchError();
    }
  }
}
