import { HttpException } from '@src/middleware/errorHandler';
import { ParameterizedContext } from 'koa';
import redis from 'ioredis';
import { PromisePool } from "mysql2"

declare module 'koa' {
  interface DefaultContext {
    customError: typeof HttpException,
    redis: redis,
    mysql: PromisePool
  }
}