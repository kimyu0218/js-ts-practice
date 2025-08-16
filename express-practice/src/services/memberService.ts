import { inject, injectable } from 'inversify';
import { Member } from '../models/member';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/memberDto';
import { MemberNotFoundError } from '../errors/memberError';
import { Op, Transaction } from 'sequelize';
import { sequelize } from '../database';

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
    return this.member.findByPkOrFail(id);
  }

  async update({ id, name, age }: UpdateMemberDto) {
    const member = await this.member.findByPkOrFail(id);
    member.name = name ?? member.name;
    member.age = age ?? member.age;
    await member.save();
  }

  async deleteById(id: number) {
    return sequelize.transaction(async (transaction: Transaction) => {
      const member = await this.member.findByPk(id, { transaction });
      if (!member) {
        throw new MemberNotFoundError(id);
      }
      await member.destroy({ transaction });
    });
  }

  async getByAgeGreaterThan(age: number) {
    return this.member.findAll({ where: { age: { [Op.gt]: age } } });
  }

  async getByAgeBetween(minAge: number, maxAge: number) {
    return this.member.findAll({ where: { age: { [Op.between]: [minAge, maxAge] } } });
  }

  async getByNameLike(name: string) {
    return this.member.findAll({ where: { name: { [Op.substring]: name } } });
  }

  async getByNameStartsWith(name: string) {
    return this.member.findAll({ where: { name: { [Op.startsWith]: name } } });
  }

  async getByCursor(limit: number, cursor: number = 0) {
    const { count, rows } = await this.member.findAndCountAll({
      where: { id: { [Op.gte]: cursor } },
      order: [['id', 'ASC']],
      limit: limit + 1,
    });

    const nextItem = count > limit ? rows.pop() : null;
    const nextCursor = nextItem?.id ?? null;
    return { result: rows, nextCursor };
  }

  async getAllAdults() {
    return this.member.scope('adult').findAll();
  }

  async getAllWithAccounts() {
    return this.member.scope('withAccounts').findAll();
  }
}
