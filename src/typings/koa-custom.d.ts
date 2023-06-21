import { HttpException } from '@src/middleware/errorHandler';
import { ParameterizedContext } from 'koa';

declare module 'koa' {
  interface DefaultContext {
    customError: typeof HttpException
  }
}