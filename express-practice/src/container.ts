import { Container } from 'inversify';
import { MemberService } from './services/memberService';
import { Member } from './models/member';
import { MemberRouter } from './routes/member';

export const container = new Container();

container.bind('MemberModel').toConstantValue(Member);
container.bind(MemberService).toSelf();
container.bind(MemberRouter).toSelf();
