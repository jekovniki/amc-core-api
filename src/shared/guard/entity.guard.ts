import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ENTITY_LOCATION_KEY } from '../decorator/entity.decorator';
import { ENTITY_LOCATION } from '../interface/entity.enum';
import { RequestUserData } from '../interface/server.interface';

@Injectable()
export class EntityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const entityLocation = this.reflector.getAllAndOverride<ENTITY_LOCATION>(ENTITY_LOCATION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const { user }: { user: RequestUserData } = request;

    if (entityLocation === ENTITY_LOCATION.PARAM) {
      const { params } = request;

      return user.entityIds.includes(params['id']);
    }

    if (entityLocation === ENTITY_LOCATION.BODY) {
      const { body } = request;

      return user.entityIds.includes(body['entityId']);
    }

    if (entityLocation === ENTITY_LOCATION.QUERY_STRING) {
      const { query } = request;

      return user.entityIds.includes(query['entityId']);
    }

    return false;
  }
}
