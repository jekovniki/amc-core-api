import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Company with ID "${id}" not found`, HttpStatus.NOT_FOUND);
  }
}
