import { AssetQueryParamFilter } from './wallet.enum';

export type GetWalletStructureResponse = {
  groupKey: string;
  assetCount: string;
  totalValue: string;
  percentage: string;
};

export type AssetQueryParams = {
  selectBy: AssetQueryParamFilter;
  value: string;
};
