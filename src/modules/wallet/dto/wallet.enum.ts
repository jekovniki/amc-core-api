export enum Currency {
  USD = 'USD',
  BGN = 'BGN',
  EUR = 'EUR',
}

export enum WalletStructureFilter {
  Code = 'code',
  ISIN = 'isin',
  Currency = 'currency',
  AssetType = 'asset_type_id',
}

export enum AssetQueryParamFilter {
  Code = 'code',
  ISIN = 'isin',
}

export enum WalletRulesType {
  PerAsset = 'per_asset',
  PerGroup = 'per_group',
}
