import { HttpException, HttpStatus } from '@nestjs/common';

export class NoEntityAccessException extends HttpException {
  constructor() {
    super(`You don't have access to this entity`, HttpStatus.FORBIDDEN);
  }
}

export class InvalidObligationStatusTypeException extends HttpException {
  constructor() {
    super(`Invalid obligation status type`, HttpStatus.BAD_REQUEST);
  }
}

export class EntityDoesNotExistException extends HttpException {
  constructor() {
    super(`Entity does not exist`, HttpStatus.BAD_REQUEST);
  }
}
