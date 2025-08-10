import { inject, injectable } from 'inversify';
import { Account } from '../models/account';
import { Member } from '../models/member';
import { MemberNotFoundError } from '../errors/memberError';

@injectable()
export class AccountService {
  constructor(
    @inject('AccountModel') private readonly account: typeof Account,
    @inject('MemberModel') private readonly member: typeof Member
  ) {}

  async create(memberId: number) {
    const member = await this.member.findByPk(memberId);
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    await this.account.create({ memberId });
  }

  async getByMemberId(memberId: number) {
    const member = await this.member.findOne({
      where: { id: memberId },
      include: [{ model: Account, as: 'accounts' }],
    });
    if (!member) {
      throw new MemberNotFoundError(memberId);
    }
    return member.accounts;
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
}
