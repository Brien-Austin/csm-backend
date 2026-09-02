import { Request, Response, NextFunction } from 'express';
import { MikroORM, RequestContext } from '@mikro-orm/core';

export const createRequestContextMiddleware = (orm: MikroORM) => {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    RequestContext.create(orm.em, next);
  };
};
