export type AccessTokenPayload = {
  iss: string;
  sub: string;
  cid: string;
  scope: string[];
  role: string;
};

export type RefreshTokenPayload = {
  iss: string;
  sub: string;
  cid: string;
};
