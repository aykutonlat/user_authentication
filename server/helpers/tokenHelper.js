import jwt from "jsonwebtoken";
import { authConfig } from "../config/authConfig.js";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    authConfig.jwtAccessTokenSecretKey,
    {
      expiresIn: authConfig.jwtAccessTokenDuration,
    }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtAccessTokenSecretKey);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const decodeAccessToken = (token) => {
  return jwt.decode(token, { complete: true });
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    authConfig.jwtRefreshTokenSecretKey,
    {
      expiresIn: authConfig.jwtRefreshTokenDuration,
    }
  );
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtRefreshTokenSecretKey);
  } catch (error) {
    return null;
  }
};

export const decodeRefreshToken = (token) => {
  return jwt.decode(token, { complete: true });
};

export const generateEmailChangeToken = (user, newEmail) => {
  return jwt.sign(
    { id: user._id, email: user.email, newEmail },
    authConfig.jwtEmailChangeTokenSecretKey,
    {
      expiresIn: authConfig.jwtEmailChangeTokenDuration,
    }
  );
};

export const verifyEmailChangeToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtEmailChangeTokenSecretKey);
  } catch (error) {
    return null;
  }
};

export const decodeEmailChangeToken = (token) => {
  return jwt.decode(token, { complete: true });
};
