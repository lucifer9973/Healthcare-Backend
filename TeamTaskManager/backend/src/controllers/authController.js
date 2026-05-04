const { z } = require('zod');

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required')
});

function createAuthController(authService) {
  return {
    signup: async (req, res) => {
      const result = await authService.signup(req.body);
      res.status(201).json({ data: result });
    },

    login: async (req, res) => {
      const result = await authService.login(req.body);
      res.status(200).json({ data: result });
    },

    me: async (req, res) => {
      const user = await authService.me(req.user.sub);
      res.status(200).json({ data: { user } });
    }
  };
}

module.exports = { createAuthController, signupSchema, loginSchema };
