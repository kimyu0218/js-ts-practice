import { inject, injectable } from 'inversify';
import { Member, MemberAttributes } from '../models/member';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/memberDto';
import { MemberNotFoundError } from '../errors/memberError';
import { FindOptions, Op } from 'sequelize';

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
    member.name = name ?? member.name;
    member.age = age ?? member.age;
    await member.save();
  }

  async deleteById(id: number) {
    const member = await this.member.findByPk(id);
    if (!member) {
      throw new MemberNotFoundError(id);
    }
    await member.destroyAccounts();
    await this.member.destroy({ where: { id } });
  }

  async getByAgeGreaterThan(age: number) {
    return this.member.findAll({ where: { age: { [Op.gt]: age } } });
  }

  async getByAgeBetween(minAge: number, maxAge: number) {
    return this.member.findAll({ where: { age: { [Op.between]: [minAge, maxAge] } } });
  }

  async getByNameLike(name: string) {
    return this.member.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
  }

  async getByNameStartsWith(name: string) {
    return this.member.findAll({ where: { name: { [Op.startsWith]: name } } });
  }

  async getByCursor(limit: number, cursor: number = 0) {
    const result = await this.member.findAll({
      where: { id: { [Op.gte]: cursor } },
      order: [['id', 'ASC']],
      limit: limit + 1,
    });

    const nextItem = result.length > limit ? result.pop() : null;
    const nextCursor = nextItem?.id ?? null;
    return { result, nextCursor };
  }
}
