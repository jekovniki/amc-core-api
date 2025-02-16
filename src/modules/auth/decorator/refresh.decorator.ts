import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestRefreshUserToken } from 'src/shared/interface/server.interface';

export const RefreshToken = createParamDecorator(
  (data: keyof RequestRefreshUserToken | undefined, context: ExecutionContext): RequestRefreshUserToken | string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
  },
);
