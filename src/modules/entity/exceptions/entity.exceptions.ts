import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor() {
    super(`Entity not found`, HttpStatus.NOT_FOUND);
  }
}
