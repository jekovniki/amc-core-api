import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidGroupIdException extends HttpException {
  constructor() {
    super(`Invalid group id`, HttpStatus.BAD_REQUEST);
  }
}
