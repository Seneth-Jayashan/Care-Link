export const signToken = async (payload) => {
  const { sign } = await import('jsonwebtoken');
  const token = sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
  return token;
};