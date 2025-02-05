import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUserData } from '../interface/server.interface';

export const User = createParamDecorator((data: keyof RequestUserData | undefined, context: ExecutionContext): RequestUserData | string => {
  const request = context.switchToHttp().getRequest();
  const user = request.user;

  return data ? user[data] : user;
});
