import {
  UserResponse,
  UsernameAvailabilityResponse,
} from '../modules/users/dto/user.response';
import { UserStatsDto } from '../modules/users/dto/user-stats.dto';

export const UsersDocs = {
  create: {
    operation: {
      summary: 'Create a new user (Super User Only)',
      description:
        'Create a new user account with specified roles and permissions',
    },
    responses: {
      201: {
        status: 201,
        description: 'User successfully created',
        type: UserResponse,
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
      403: {
        status: 403,
        description: 'Forbidden - User is not a Super User',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 403 },
            message: {
              type: 'string',
              example: 'User does not have required roles',
            },
            error: { type: 'string', example: 'Forbidden' },
          },
        },
      },
      409: {
        status: 409,
        description: 'Username already exists',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 409 },
            message: { type: 'string', example: 'Username already exists' },
            error: { type: 'string', example: 'Conflict' },
          },
        },
      },
    },
  },

  findByUsername: {
    operation: {
      summary: 'Get user by username (Public)',
      description: 'Retrieve public user information by their username',
    },
    params: {
      username: {
        name: 'username',
        description: 'Username of the user to retrieve',
        example: 'john_doe',
      },
    },
    responses: {
      200: {
        status: 200,
        description: 'User found',
        type: UserResponse,
      },
      404: {
        status: 404,
        description: 'User not found',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'User not found' },
            error: { type: 'string', example: 'Not Found' },
          },
        },
      },
    },
  },

  checkUsername: {
    operation: {
      summary: 'Check username availability (Public)',
      description: 'Check if a username is available for registration',
    },
    query: {
      username: {
        name: 'username',
        required: true,
        type: String,
        description: 'Username to check availability',
        example: 'john_doe',
      },
    },
    responses: {
      200: {
        status: 200,
        description: 'Username availability status',
        type: UsernameAvailabilityResponse,
      },
      400: {
        status: 400,
        description: 'Bad Request - Invalid username format',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'Invalid username format' },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  },

  getAllUserStats: {
    operation: {
      summary: 'Get stats for all users (Super User Only)',
      description: 'Retrieve detailed statistics for all users in the system',
    },
    responses: {
      200: {
        status: 200,
        description: 'List of user statistics',
        type: [UserStatsDto],
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
      403: {
        status: 403,
        description: 'Forbidden - User is not a Super User',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 403 },
            message: {
              type: 'string',
              example: 'User does not have required roles',
            },
            error: { type: 'string', example: 'Forbidden' },
          },
        },
      },
    },
  },

  getUserStats: {
    operation: {
      summary: 'Get stats for a specific user (Super User Only)',
      description: 'Retrieve detailed statistics for a specific user',
    },
    params: {
      username: {
        name: 'username',
        description: 'Username of the user to get stats for',
        example: 'john_doe',
      },
    },
    responses: {
      200: {
        status: 200,
        description: 'User statistics',
        type: UserStatsDto,
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
      403: {
        status: 403,
        description: 'Forbidden - User is not a Super User',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 403 },
            message: {
              type: 'string',
              example: 'User does not have required roles',
            },
            error: { type: 'string', example: 'Forbidden' },
          },
        },
      },
      404: {
        status: 404,
        description: 'User not found',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'User not found' },
            error: { type: 'string', example: 'Not Found' },
          },
        },
      },
    },
  },

  promoteToSuperUser: {
    operation: {
      summary: 'Promote user to Super User (Super User Only)',
      description: 'Grant Super User privileges to a regular user',
    },
    params: {
      username: {
        name: 'username',
        description: 'Username of the user to promote',
        example: 'john_doe',
      },
    },
    responses: {
      200: {
        status: 200,
        description: 'User promoted to Super User',
        type: UserStatsDto,
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
      403: {
        status: 403,
        description: 'Forbidden - User is not a Super User',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 403 },
            message: {
              type: 'string',
              example: 'User does not have required roles',
            },
            error: { type: 'string', example: 'Forbidden' },
          },
        },
      },
      404: {
        status: 404,
        description: 'User not found',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'User not found' },
            error: { type: 'string', example: 'Not Found' },
          },
        },
      },
    },
  },

  demoteFromSuperUser: {
    operation: {
      summary: 'Demote user from Super User (Super User Only)',
      description: 'Remove Super User privileges from a user',
    },
    params: {
      username: {
        name: 'username',
        description: 'Username of the user to demote',
        example: 'john_doe',
      },
    },
    responses: {
      200: {
        status: 200,
        description: 'User demoted from Super User',
        type: UserStatsDto,
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
      403: {
        status: 403,
        description: 'Forbidden - User is not a Super User',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 403 },
            message: {
              type: 'string',
              example: 'User does not have required roles',
            },
            error: { type: 'string', example: 'Forbidden' },
          },
        },
      },
      404: {
        status: 404,
        description: 'User not found',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'User not found' },
            error: { type: 'string', example: 'Not Found' },
          },
        },
      },
    },
  },

  getAllUsers: {
    operation: {
      summary: 'Get all users (Super User Only)',
      description: 'Retrieve a list of all users in the system',
    },
    responses: {
      200: {
        status: 200,
        description: 'List of all users',
        type: UserStatsDto,
        isArray: true,
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
      403: {
        status: 403,
        description: 'Forbidden - User is not a Super User',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 403 },
            message: {
              type: 'string',
              example: 'User does not have required roles',
            },
            error: { type: 'string', example: 'Forbidden' },
          },
        },
      },
    },
  },
};
