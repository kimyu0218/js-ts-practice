import { inject, injectable } from 'inversify';
import { Member, MemberAttributes } from '../models/member';
import {
  CreateMemberRequestDto,
  GetByAgeBetweenRequestDto,
  GetByCursorRequestDto,
  GetByCursorResponseDto,
  GetByNameRequestDto,
  UpdateMemberRequestDto,
} from '../dtos/memberDto';
import { MemberNotFoundError } from '../errors/memberError';
import { Op, Transaction } from 'sequelize';
import { sequelize } from '../database';

@injectable()
export class MemberService {
  constructor(@inject('MemberModel') private readonly member: typeof Member) {}

  async create({ name, age }: CreateMemberRequestDto): Promise<void> {
    if (age) {
      await this.member.create({ name, age });
    } else {
      await this.member.create({ name });
    }
  }

  async getAll(): Promise<MemberAttributes[]> {
    const members = await this.member.findAll();
    return members.map((member) => member.toJSON());
  }

  async getById(id: number): Promise<MemberAttributes> {
    return (await this.member.findByPkOrFail(id)).toJSON();
  }

  async update({ id, name, age }: UpdateMemberRequestDto): Promise<void> {
    const member = await this.member.findByPkOrFail(id);
    member.name = name ?? member.name;
    member.age = age ?? member.age;
    await member.save();
  }

  async deleteById(id: number): Promise<void> {
    return sequelize.transaction(async (transaction: Transaction) => {
      const member = await this.member.findByPk(id, { transaction });
      if (!member) {
        throw new MemberNotFoundError(id);
      }
      await member.destroy({ transaction });
    });
  }

  async getByAgeGreaterThan(age: number): Promise<MemberAttributes[]> {
    const members = await this.member.findAll({ where: { age: { [Op.gt]: age } } });
    return members.map((member) => member.toJSON());
  }

  async getByAgeBetween({ minAge, maxAge }: GetByAgeBetweenRequestDto): Promise<MemberAttributes[]> {
    const members = await this.member.findAll({ where: { age: { [Op.between]: [minAge, maxAge] } } });
    return members.map((member) => member.toJSON());
  }

  async getByNameLike({ name }: GetByNameRequestDto): Promise<MemberAttributes[]> {
    const members = await this.member.findAll({ where: { name: { [Op.substring]: name } } });
    return members.map((member) => member.toJSON());
  }

  async getByNameStartsWith({ name }: GetByNameRequestDto): Promise<MemberAttributes[]> {
    const members = await this.member.findAll({ where: { name: { [Op.startsWith]: name } } });
    return members.map((member) => member.toJSON());
  }

  async getByCursor({ limit, cursor = 0 }: GetByCursorRequestDto): Promise<GetByCursorResponseDto> {
    const { count, rows } = await this.member.findAndCountAll({
      where: { id: { [Op.gte]: cursor } },
      order: [['id', 'ASC']],
      limit: limit + 1,
    });

    const nextItem = count > limit ? rows.pop() : null;
    const nextCursor = nextItem?.id ?? null;
    return { result: rows.map((row) => row.toJSON()), nextCursor };
  }

  async getAllAdults(): Promise<MemberAttributes[]> {
    const members = await this.member.scope('adult').findAll();
    return members.map((member) => member.toJSON());
  }

  async getAllWithAccounts(): Promise<MemberAttributes[]> {
    const members = await this.member.scope('withAccounts').findAll();
    return members.map((member) => member.toJSON());
  }
}
