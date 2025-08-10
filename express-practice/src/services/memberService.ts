import { inject, injectable } from 'inversify';
import { Member } from '../models/member';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/memberDto';
import { MemberNotFoundError } from '../errors/memberError';

@injectable()
export class MemberService {
  constructor(@inject('MemberModel') private readonly member: typeof Member) {}

  async create({ name, age }: CreateMemberDto) {
    if (age) {
      await this.member.create({ name, age });
    } else {
      await this.member.create({ name });
    }
  }

  async getAll() {
    return await this.member.findAll();
  }

  async getById(id: number): Promise<Member> {
    const member = await this.member.findByPk(id);
    if (!member) {
      throw new MemberNotFoundError(id);
    }
    return member;
  }

  async update({ id, name, age }: UpdateMemberDto) {
    const member = await this.member.findByPk(id);
    if (!member) {
      throw new MemberNotFoundError(id);
    }
    member.name = name;
    if (age) {
      member.age = age;
    }
    await member.save();
  }

  async deleteById(id: number) {
    const result = await this.member.destroy({ where: { id } });
    if (result == 0) {
      throw new MemberNotFoundError(id);
    }
  }
}
