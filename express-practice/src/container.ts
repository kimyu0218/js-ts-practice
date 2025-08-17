import { Container } from 'inversify';
import { MemberService } from './services/memberService';
import { Member } from './models/member';
import { MemberRouter } from './routes/member';
import { Account } from './models/account';
import { AccountService } from './services/accountService';
import { AuthRouter } from './routes/auth';

export const container = new Container();

container.bind('MemberModel').toConstantValue(Member);
container.bind(MemberService).toSelf();
container.bind(MemberRouter).toSelf();

container.bind('AccountModel').toConstantValue(Account);
container.bind(AccountService).toSelf();

container.bind(AuthRouter).toSelf();

container.bind('JwtSecretKey').toConstantValue(process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY');
