export type AccessTokenPayload = {
  iss: string;
  sub: string;
  cid: string;
  eid: string[];
  scope: string[];
  role: string;
};

export type RefreshTokenPayload = {
  iss: string;
  sub: string;
  cid: string;
};

export type SessionDataResponse = {
  sessionData: string;
  refreshToken: string;
  accessToken: string;
};
