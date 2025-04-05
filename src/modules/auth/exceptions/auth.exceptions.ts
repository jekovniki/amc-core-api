import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor(message = 'Invalid email or password') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotFoundException extends HttpException {
  constructor(message = 'User not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class IncompleteRegistrationException extends HttpException {
  constructor(message = 'Please complete registration before you try to sign in') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class InactiveUserException extends HttpException {
  constructor(message = 'The user is no longer active') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class AlreadyRegisteredUserException extends HttpException {
  constructor(message = 'User has already been registered') {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InvalidTokenException extends HttpException {
  constructor(message = 'Invalid or expired token') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class MissingTokenException extends HttpException {
  constructor(message = 'Missing token') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class SamePasswordException extends HttpException {
  constructor(message = 'New password should not be the same as the old password') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidRefreshTokenException extends HttpException {
  constructor(message = 'Invalid refresh token') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
