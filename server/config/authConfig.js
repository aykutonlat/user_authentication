import dotenv from "dotenv";

dotenv.config();

export const authConfig = {
  jwtAccessTokenSecretKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
  jwtAccessTokenDuration: process.env.JWT_ACCESS_TOKEN_DURATION,
  jwtRefreshTokenSecretKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  jwtRefreshTokenDuration: process.env.JWT_REFRESH_TOKEN_DURATION,
};
