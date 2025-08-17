import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { authenticate } from './middlewares/authenticate';
import morgan from 'morgan';
import { AuthRouter } from './routes/auth';
import { MemberRouter } from './routes/member';
import { errorHandler } from './middlewares/errorHandler';
import { container } from './container';

const app = express();
const port = 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(authenticate);
app.use('/auth', container.get(AuthRouter).router);
app.use('/members', container.get(MemberRouter).router);

app.use((req, res, next) => {
  const error = new Error(`Router not found: ${req.method} ${req.url}`);
  error.status = 404;
  return next(error);
});
app.use(errorHandler);

app.listen(port);
