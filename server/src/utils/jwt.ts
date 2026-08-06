import jwt, { SignOptions } from 'jsonwebtoken';

export const generateAccessToken = (userId: string, role: string) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
  };
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'fallback_secret_key', options);
};

export const generateRefreshToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  };
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', options);
};
