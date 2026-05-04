import { createRequire } from 'module';
import { describe, it, expect } from 'vitest';

const require = createRequire(import.meta.url);
const { createAuthService } = require('../src/services/authService');

describe('auth service', () => {
  it('signs up and logs in a member', async () => {
    const state = { users: [] };
    const userRepo = {
      findByEmail: async (email) => state.users.find((user) => user.email === email) || null,
      createUser: async (user) => {
        const stored = {
          id: state.users.length + 1,
          name: user.name,
          email: user.email,
          password_hash: user.passwordHash,
          role: user.role,
          created_at: 'now',
          updated_at: 'now'
        };
        state.users.push(stored);
        return {
          id: stored.id,
          name: stored.name,
          email: stored.email,
          role: stored.role,
          created_at: stored.created_at,
          updated_at: stored.updated_at
        };
      },
      findById: async (id) => state.users.find((user) => Number(user.id) === Number(id)) || null
    };

    const authService = createAuthService({
      userRepo,
      hashPassword: async (value) => `hash:${value}`,
      comparePassword: async (value, hash) => hash === `hash:${value}`,
      signToken: (payload) => `token:${payload.sub}`
    });

    const signup = await authService.signup({
      name: 'Ada Lovelace',
      email: 'ADA@example.com',
      password: 'password123'
    });

    expect(signup.user.email).toBe('ada@example.com');
    expect(signup.token).toBe('token:1');

    const login = await authService.login({
      email: 'ada@example.com',
      password: 'password123'
    });

    expect(login.user.name).toBe('Ada Lovelace');
    expect(login.user.role).toBe('member');
  });
});