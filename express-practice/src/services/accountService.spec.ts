import { AccountService } from './accountService';
import { container } from '../container';
import { clearTestDatabase, closeTestDatabase, initTestDatabase } from '../database';
import { Account } from '../models/account';
import { Member } from '../models/member';
import { MemberNotFoundError } from '../errors/memberError';

describe('AccountService', () => {
  let sut: AccountService;
  let accountModel: typeof Account;
  let memberModel: typeof Member;

  beforeAll(async () => {
    await initTestDatabase();
    sut = container.get(AccountService);
    accountModel = container.get('AccountModel');
    memberModel = container.get('MemberModel');
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  beforeEach(async () => {
    await clearTestDatabase();
  });

  describe('create', () => {
    it('should create account', async () => {
      const memberId = (await memberModel.create({ name: '홍길동' })).id;

      await sut.create(memberId);

      const actual = await accountModel.findOne({ where: { memberId } });
      expect(actual).not.toBeNull();
    });

    it('should throw error', async () => {
      await expect(sut.create(0)).rejects.toBeInstanceOf(MemberNotFoundError);
    });
  });

  describe('getByMemberId', () => {
    it('should return accounts', async () => {
      const memberId = (await memberModel.create({ name: '홍길동' })).id;
      await accountModel.bulkCreate([{ memberId }, { memberId }, { memberId }]);

      const actual = await sut.getByMemberId(memberId);
      expect(actual?.length).toBe(3);
    });

    it('should throw error', async () => {
      await expect(sut.getByMemberId(0)).rejects.toBeInstanceOf(MemberNotFoundError);
    });
  });

  describe('deleteByMemberId', () => {
    it('should delete accounts', async () => {
      const memberId = (await memberModel.create({ name: '홍길동' })).id;
      await accountModel.bulkCreate([{ memberId }, { memberId }, { memberId }]);

      await sut.deleteByMemberId(memberId);

      const actual = await accountModel.findAll({ where: { memberId } });
      expect(actual).toEqual([]);
    });

    it('should throw error', async () => {
      await expect(sut.deleteByMemberId(0)).rejects.toBeInstanceOf(MemberNotFoundError);
    });
  });
});
