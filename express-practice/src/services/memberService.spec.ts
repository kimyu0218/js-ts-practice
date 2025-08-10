import { MemberService } from './memberService';
import { container } from '../container';
import { clearTestDatabase, closeTestDatabase, initTestDatabase } from '../database';
import { CreateMemberDto, UpdateMemberDto } from '../dtos/memberDto';
import { Member } from '../models/member';
import { MemberNotFoundError } from '../errors/memberError';

describe('MemberService', () => {
  let sut: MemberService;
  let memberModel: typeof Member;

  beforeAll(async () => {
    await initTestDatabase();
    sut = container.get(MemberService);
    memberModel = container.get('MemberModel');
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

    const actual = (await memberModel.findAll())[0] as Member;
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

      await sut.deleteById(id);

      const actual = await memberModel.findByPk(id);
      expect(actual).toBe(null);
    });

    it('should throw error', async () => {
      await expect(sut.deleteById(0)).rejects.toBeInstanceOf(MemberNotFoundError);
    });
  });
});
