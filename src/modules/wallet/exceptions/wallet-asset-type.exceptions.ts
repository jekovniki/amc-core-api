import { HttpException, HttpStatus } from '@nestjs/common';

export class AssetTypeEditForbiddenException extends HttpException {
  constructor() {
    super(`You can't edit this asset`, HttpStatus.FORBIDDEN);
  }
}

export class AssetTypeNotExistException extends HttpException {
  constructor() {
    super(`Asset type does not exist`, HttpStatus.FORBIDDEN);
  }
}
