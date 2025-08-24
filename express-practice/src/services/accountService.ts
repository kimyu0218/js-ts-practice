import { inject, injectable } from 'inversify';
import { Account } from '../models/account';
import { Member } from '../models/member';
import { MemberNotFoundError } from '../errors/memberError';
import { AccountNotFoundError, PasswordMismatchError } from '../errors/accountError';
import { CreateAccountDto, LoginRequestDto } from '../dtos/accountDto';
import { bcryptCompare } from '../utils/hash';

@injectable()
export class AccountService {
  constructor(
    @inject('AccountModel') private readonly account: typeof Account,
    @inject('MemberModel') private readonly member: typeof Member
  ) {}

  async create({ memberId, password }: CreateAccountDto): Promise<void> {
    await this.member.findByPkOrFail(memberId);
    await this.account.create({ memberId, password });
  }

  private async getById(id: number): Promise<Account> {
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

    if (!member.accounts) {
      return [];
    }
    return member.accounts.map((account) => account.toJSON());
  }

  async deleteByMemberId(memberId: number): Promise<void> {
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

  async login({ id, password }: LoginRequestDto): Promise<void> {
    const account = await this.getById(id);
    if (!bcryptCompare(password, account.password)) {
      throw new PasswordMismatchError();
    }
  }
}
