import { HttpException, HttpStatus } from '@nestjs/common';
import { AssetQueryParamFilter, WalletStructureFilter } from '../dto/wallet.enum';

export class WalletNotFoundException extends HttpException {
  constructor() {
    super(`Wallet does not exist`, HttpStatus.BAD_REQUEST);
  }
}

export class AssetNotFoundException extends HttpException {
  constructor() {
    super('Asset not found', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidAssetIdException extends HttpException {
  constructor() {
    super('Invalid asset id', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidWalletFilterException extends HttpException {
  constructor() {
    super(`Invalid wallet filter. Provide a valid filter : [${Object.values(WalletStructureFilter).join(', ')}]`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidAssetQueryParamsException extends HttpException {
  constructor() {
    super(
      `Invalid query params. Provide a valid query params : [${Object.values(AssetQueryParamFilter).join(', ')}]`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class InvalidAmountException extends HttpException {
  constructor() {
    super(`Please provide a valid amount`, HttpStatus.BAD_REQUEST);
  }
}

export class MissingQueryParamsException extends HttpException {
  constructor() {
    super(`Please provide query params`, HttpStatus.BAD_REQUEST);
  }
}
