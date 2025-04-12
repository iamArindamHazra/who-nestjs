# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-03-21

### Added

- Initial release of the Anonymous Message API
- API versioning with URI-based version prefix (api/v1)
- Swagger documentation available at `/docs` endpoint (non-production only)
- Security features:
  - Helmet middleware for HTTP security headers
  - Compression middleware for response compression
  - Cookie parser middleware
  - CORS configuration with customizable origins
- Global validation pipe with strict settings:
  - Whitelist validation
  - Automatic transformation
  - Forbidden non-whitelisted properties
  - Forbidden unknown values
  - Implicit conversion enabled
- Environment-based configuration using ConfigService
- Logging configuration:
  - Error logging
  - Warning logging
  - Standard logging
  - Buffer logs enabled
- API Documentation:
  - Swagger UI setup for development environment
  - Bearer authentication support in Swagger
  - API versioning documentation
  - Detailed API description and endpoints

### Security

- Implemented secure CORS policy with:
  - Configurable origins
  - Limited HTTP methods (GET, POST, PATCH, DELETE, OPTIONS)
  - Credentials support
  - Restricted headers
  - Maximum age configuration (1 hour)

[1.0.0]: https://github.com/username/repo/releases/tag/v1.0.0
