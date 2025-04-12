import { AuthTokensResponse } from '../modules/auth/dto/auth-tokens.response';

export const AuthDocs = {
  register: {
    operation: {
      summary: 'Register a new user (Public)',
      description:
        'Create a new user account with username, email, and password',
    },
    responses: {
      201: {
        status: 201,
        description: 'User successfully registered',
        type: AuthTokensResponse,
      },
      409: {
        status: 409,
        description: 'Username or email already exists',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 409 },
            message: { type: 'string', example: 'Username already exists' },
            error: { type: 'string', example: 'Conflict' },
          },
        },
      },
      400: {
        status: 400,
        description: 'Bad Request - Invalid input data',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            message: {
              type: 'array',
              items: { type: 'string' },
              example: ['username must be a string'],
            },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  },

  login: {
    operation: {
      summary: 'Login with username/email and password (Public)',
      description: 'Authenticate user and receive access and refresh tokens',
    },
    responses: {
      200: {
        status: 200,
        description: 'User successfully logged in',
        type: AuthTokensResponse,
      },
      401: {
        status: 401,
        description: 'Invalid credentials',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Invalid credentials' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  },

  refresh: {
    operation: {
      summary: 'Refresh access token (Public)',
      description: 'Get new access token using a valid refresh token',
    },
    responses: {
      200: {
        status: 200,
        description: 'New access token generated',
        type: AuthTokensResponse,
      },
      401: {
        status: 401,
        description: 'Invalid or expired refresh token',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Invalid refresh token' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  },

  logout: {
    operation: {
      summary: 'Logout and revoke all refresh tokens (Authenticated)',
      description: 'Invalidate all refresh tokens for the current user',
    },
    responses: {
      200: {
        status: 200,
        description: 'Successfully logged out',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Successfully logged out' },
          },
        },
      },
      401: {
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  },

  updateEmail: {
    operation: {
      summary: 'Update email address (Authenticated)',
      description: 'Update the email address for the authenticated user',
    },
    responses: {
      200: {
        status: 200,
        description: 'Email successfully updated',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Email updated successfully' },
            email: { type: 'string', example: 'newemail@example.com' },
          },
        },
      },
      409: {
        status: 409,
        description: 'Email already exists',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 409 },
            message: { type: 'string', example: 'Email already exists' },
            error: { type: 'string', example: 'Conflict' },
          },
        },
      },
      401: {
        status: 401,
        description: 'Unauthorized - Invalid or missing token',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            message: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  },
};
