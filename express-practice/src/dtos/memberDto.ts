import { MemberAttributes } from '../models/member';

export type CreateMemberRequestDto = Pick<MemberAttributes, 'name' | 'age'>;
export type UpdateMemberRequestDto = Pick<MemberAttributes, 'id'> & Partial<Omit<MemberAttributes, 'id'>>;
export type GetByAgeGreaterThanRequestDto = Pick<MemberAttributes, 'age'>;
export type GetByAgeBetweenRequestDto = { minAge: number; maxAge: number };
export type GetByNameRequestDto = Pick<MemberAttributes, 'name'>;
export type GetByCursorRequestDto = { limit: number; cursor?: number };

export type GetByCursorResponseDto = { result: MemberAttributes[]; nextCursor: number | null };
