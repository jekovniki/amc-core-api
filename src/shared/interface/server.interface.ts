import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: RequestUserData;
}

interface BaseUserData {
  id: string;
  companyId: string;
}

export interface RequestUserData extends BaseUserData {
  permissions: string[];
}

export interface RequestRefreshUserToken extends BaseUserData {
  refreshToken: string;
}
