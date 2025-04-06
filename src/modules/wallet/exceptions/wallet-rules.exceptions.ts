import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidRuleIdException extends HttpException {
  constructor() {
    super(`Invalid rule id`, HttpStatus.BAD_REQUEST);
  }
}
