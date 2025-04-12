import { MessageResponse } from '../modules/messages/dto/message.response';

export const MessagesDocs = {
  create: {
    operation: {
      summary: 'Create a new message (Public)',
      description: 'Send an anonymous message to a user',
    },
    responses: {
      201: {
        status: 201,
        description: 'Message successfully created',
        type: MessageResponse,
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
              example: ['content must not be empty'],
            },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
      404: {
        status: 404,
        description: 'Recipient not found',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Recipient not found' },
            error: { type: 'string', example: 'Not Found' },
          },
        },
      },
      429: {
        status: 429,
        description: 'Too Many Requests - Rate limit exceeded',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 429 },
            message: {
              type: 'string',
              example: 'ThrottlerException: Too Many Requests',
            },
          },
        },
      },
    },
  },

  findMyMessages: {
    operation: {
      summary: 'Get messages for the logged-in user (Authenticated)',
      description: 'Retrieve all messages sent to the authenticated user',
    },
    responses: {
      200: {
        status: 200,
        description: 'Messages found',
        type: [MessageResponse],
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

  findByRecipient: {
    operation: {
      summary: 'Get messages by username (Authenticated)',
      description:
        'Retrieve messages for a specific user. Access restricted to:\n\n' +
        '1. The user themselves (can view their own messages)\n' +
        "2. Super users (can view any user's messages)\n\n" +
        'Note: Even super users can only view message counts and metadata, not the actual message content.',
    },
    params: {
      username: {
        name: 'username',
        required: true,
        description: 'Username of the message recipient',
        example: 'john_doe',
      },
    },
    responses: {
      200: {
        status: 200,
        description: 'Messages successfully retrieved',
        type: [MessageResponse],
        content: {
          'application/json': {
            example: [
              {
                _id: '507f1f77bcf86cd799439011',
                recipientUsername: 'john_doe',
                content: 'Hello, how are you?',
                isRead: false,
                createdAt: '2024-03-21T10:00:00.000Z',
                updatedAt: '2024-03-21T10:00:00.000Z',
              },
              {
                _id: '507f1f77bcf86cd799439012',
                recipientUsername: 'john_doe',
                content: 'Meeting at 2 PM',
                isRead: true,
                createdAt: '2024-03-21T09:00:00.000Z',
                updatedAt: '2024-03-21T09:30:00.000Z',
              },
            ],
          },
        },
      },
      401: {
        status: 401,
        description: 'Unauthorized - User is not logged in',
        content: {
          'application/json': {
            example: {
              statusCode: 401,
              message: 'Unauthorized',
              error: 'User must be logged in to access messages',
            },
          },
        },
      },
      403: {
        status: 403,
        description: 'Forbidden - User does not have permission',
        content: {
          'application/json': {
            example: {
              statusCode: 403,
              message: 'Insufficient permissions to access these messages',
              error: 'Forbidden',
            },
          },
        },
      },
    },
  },

  markAsRead: {
    operation: {
      summary: 'Mark a message as read (Authenticated)',
      description: 'Mark a specific message as read for the authenticated user',
    },
    params: {
      messageId: {
        name: 'messageId',
        description: 'The ID of the message to mark as read',
        example: '507f1f77bcf86cd799439011',
      },
    },
    responses: {
      200: {
        status: 200,
        description: 'Message marked as read',
        type: MessageResponse,
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
        description: 'Forbidden - User does not own the message',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 403 },
            message: {
              type: 'string',
              example: 'You are not authorized to access this message',
            },
            error: { type: 'string', example: 'Forbidden' },
          },
        },
      },
      404: {
        status: 404,
        description: 'Message not found',
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 404 },
            message: { type: 'string', example: 'Message not found' },
            error: { type: 'string', example: 'Not Found' },
          },
        },
      },
    },
  },
};
