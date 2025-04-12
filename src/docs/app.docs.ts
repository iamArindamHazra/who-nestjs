export const AppDocs = {
  getHello: {
    operation: {
      summary: 'Get hello message (Public)',
      description: 'Returns a greeting message to verify the API is running',
    },
    responses: {
      200: {
        status: 200,
        description: 'Returns a greeting message',
        schema: {
          type: 'string',
          example: 'Hello World!',
        },
      },
    },
  },
};
