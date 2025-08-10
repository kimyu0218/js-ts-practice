import { MemberAttributes } from '../models/member';

export type CreateMemberDto = Pick<MemberAttributes, 'name' | 'age'>;
export type UpdateMemberDto = MemberAttributes;
