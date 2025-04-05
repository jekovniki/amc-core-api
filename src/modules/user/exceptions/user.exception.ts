import { HttpException, HttpStatus } from '@nestjs/common';

export class CantDeleteYourselfException extends HttpException {
  constructor() {
    super(`You can't delete yourself from the system`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidCompanyTokenException extends HttpException {
  constructor(message = 'Invalid or expired company token') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class MissingCompanyTokenException extends HttpException {
  constructor(message = 'Missing company token') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class RoleNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Role with ID '${id}' not found`, HttpStatus.BAD_REQUEST);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(message = 'User not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class CantDeleteUsersFromOtherCompaniesException extends HttpException {
  constructor(message = `You can't delete users from different companies`) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
