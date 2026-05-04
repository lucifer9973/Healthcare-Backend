const { ApiError } = require('../lib/apiError');

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

function createAuthService({ userRepo, hashPassword, comparePassword, signToken }) {
  return {
    async signup({ name, email, password }) {
      const normalizedEmail = email.toLowerCase();
      const existingUser = await userRepo.findByEmail(normalizedEmail);

      if (existingUser) {
        throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'A user with this email already exists');
      }

      const passwordHash = await hashPassword(password);
      const user = await userRepo.createUser({
        name,
        email: normalizedEmail,
        passwordHash,
        role: 'member'
      });
      const token = signToken({ sub: String(user.id), role: user.role, email: user.email, name: user.name });

      return { user: sanitizeUser(user), token };
    },

    async login({ email, password }) {
      const normalizedEmail = email.toLowerCase();
      const user = await userRepo.findByEmail(normalizedEmail);

      if (!user) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const token = signToken({ sub: String(user.id), role: user.role, email: user.email, name: user.name });
      return { user: sanitizeUser(user), token };
    },

    async me(userId) {
      const user = await userRepo.findById(userId);
      return sanitizeUser(user);
    }
  };
}

module.exports = { createAuthService };
