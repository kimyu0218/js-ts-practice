import { MemberService } from './memberService';
import { container } from '../container';
import { clearTestDatabase, closeTestDatabase, initTestDatabase } from '../database';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/memberDto';
import { Member } from '../models/member';
import { MemberNotFoundError } from '../errors/memberError';
import { Account } from '../models/account';

describe('MemberService', () => {
  let sut: MemberService;
  let memberModel: typeof Member;
  let accountModel: typeof Account;

  beforeAll(async () => {
    await initTestDatabase();
    sut = container.get(MemberService);
    memberModel = container.get('MemberModel');
    accountModel = container.get('AccountModel');
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  it('create', async () => {
    const member: CreateMemberDto = { name: '홍길동' };

    await sut.create(member);

    const actual = (await memberModel.findOne()) as Member;
    expect(actual.name).toBe('홍길동');
  });

  it('getAll', async () => {
    const members: CreateMemberDto[] = [{ name: '홍길동' }, { name: '고길동' }];

    await Promise.all(members.map((member) => memberModel.create(member)));

    const actual = (await sut.getAll()) as Member[];
    expect(actual.length).toBe(2);
    expect(actual).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: '홍길동' }), expect.objectContaining({ name: '고길동' })])
    );
  });

  describe('getById', () => {
    it('should return member', async () => {
      const id = (await memberModel.create({ name: '홍길동' })).id;

      const actual = await sut.getById(id);

      expect(actual.name).toBe('홍길동');
    });

    it('should throw error', async () => {
      await expect(sut.getById(0)).rejects.toBeInstanceOf(MemberNotFoundError);
    });
  });

  describe('update', () => {
    it('should update member', async () => {
      const id = (await memberModel.create({ name: '홍길동' })).id;
      const member: UpdateMemberDto = { id, name: '고길동' };

      await sut.update(member);

      const actual = (await memberModel.findByPk(id)) as Member;
      expect(actual.name).toBe('고길동');
    });

    it('should throw error', async () => {
      const member: UpdateMemberDto = { id: 0, name: '고길동' };

      await expect(sut.update(member)).rejects.toBeInstanceOf(MemberNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete member', async () => {
      const id = (await memberModel.create({ name: '홍길동' })).id;
      await accountModel.create({ memberId: id, password: 'passwd' });

      await sut.deleteById(id);

      const actual1 = await memberModel.findByPk(id);
      const actual2 = await accountModel.findAll({ where: { memberId: id } });
      expect(actual1).toBe(null);
      expect(actual2).toEqual([]);
    });

    it('should throw error', async () => {
      await expect(sut.deleteById(0)).rejects.toBeInstanceOf(MemberNotFoundError);
    });
  });

  it('getByAgeGreaterThan', async () => {
    await memberModel.bulkCreate([
      { name: '홍길동', age: 10 },
      { name: '고길동', age: 20 },
    ]);

    const actual = await sut.getByAgeGreaterThan(10);
    expect(actual.length).toBe(1);
    expect((actual[0] as Member).name).toBe('고길동');
  });

  it('getByAgeBetween', async () => {
    await memberModel.bulkCreate([
      { name: '홍길동', age: 10 },
      { name: '고길동', age: 20 },
    ]);

    const actual = await sut.getByAgeBetween(0, 30);
    expect(actual.length).toBe(2);
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: '홍길동', age: 10 }),
        expect.objectContaining({ name: '고길동', age: 20 }),
      ])
    );
  });

  it('getByNameLike', async () => {
    await memberModel.bulkCreate([
      { name: '홍길동', age: 10 },
      { name: '고길동', age: 20 },
      { name: '고둘리', age: 0 },
    ]);

    const actual = await sut.getByNameLike('길동');
    expect(actual.length).toBe(2);
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: '홍길동', age: 10 }),
        expect.objectContaining({ name: '고길동', age: 20 }),
      ])
    );
  });

  it('getByNameStartsWith', async () => {
    await memberModel.bulkCreate([
      { name: '홍길동', age: 10 },
      { name: '고길동', age: 20 },
      { name: '고둘리', age: 0 },
    ]);

    const actual = await sut.getByNameStartsWith('고');
    expect(actual.length).toBe(2);
    expect(actual).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: '고길동', age: 20 }),
        expect.objectContaining({ name: '고둘리', age: 0 }),
      ])
    );
  });

  it('getByCursor', async () => {
    await memberModel.bulkCreate([
      { name: '홍길동', age: 10 },
      { name: '고길동', age: 20 },
      { name: '고둘리', age: 0 },
    ]);

    const actual1 = await sut.getByCursor(2);
    const actual2 = await sut.getByCursor(2, actual1.nextCursor as number);
    expect(actual1.result.length).toBe(2);
    expect(typeof actual1.nextCursor).toBe('number');
    expect(actual2.result.length).toBe(1);
    expect(actual2.nextCursor).toBeNull();
  });
});
