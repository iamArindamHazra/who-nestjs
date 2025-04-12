export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri:
      process.env.MONGODB_URI || 'mongodb://localhost:27017/anonymous-messages',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
  },
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
});
