export const CreateUserValidationMessage = {
  name: {
    required: 'name is required',
    length: 'Min length is 1, max is 15',
  },
  email: {
    invalidFormat: 'email must be valid address',
  },
  avatarUrl: {
    invalidFormat: 'avatarUrl path is required',
  },
  password: {
    required: 'password is required',
    length: 'Min length for password is 6, max is 12',
  },
  type: {
    invalidFormat: 'type must be one of: обычный, pro',
  },
} as const;
