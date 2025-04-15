# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.6] - 2025-04-12

### Changed

- Modified CreateUserDto to accept empty strings for emails during account creation

## [0.0.5] - 2025-04-15

### Changed

- Updated all import paths to use absolute imports from 'src/' for better maintainability
- Updated dependencies:
  - Updated mime-types to version 3.0.1
  - Updated mime to version 2.6.0
  - Updated swagger-ui-dist to version 5.21.0
  - Updated ts-jest to version 29.3.2
  - Updated various other dependencies to their latest compatible versions
- Enhanced module organization with consistent import paths
- Improved code maintainability with standardized import structure

## [0.0.4] - 2025-04-12

### Changed

- Added proper index for username and email in MongoDB
- Added lesser request logs

## [0.0.3] - 2025-04-12

### Added

- Pagination Support:
  - Added common pagination module and service
  - Implemented paginated response for user listing
  - Added filtering capabilities for user queries
  - Added sorting functionality
- API Improvements:
  - Enhanced API documentation with detailed query parameters
  - Added new filtering options for username and message count
  - Consolidated user stats endpoints for better organization
  - Improved Swagger documentation with pagination details

### Changed

- Refactored Users API:
  - Combined getAllUsers and getAllUserStats endpoints
  - Updated response format to include pagination metadata
  - Enhanced query filtering capabilities
  - Added support for case-insensitive username search

## [0.0.2] - 2025-04-12

### Added

- Authentication and Authorization:
  - JWT-based authentication system
  - Local passport strategy for username/password auth
  - Role-based access control (RBAC) with User and Super User roles
  - Protected routes with JWT guard
  - User promotion and demotion capabilities for super users
- Enhanced User Management:
  - Email support in user profiles
  - User statistics and activity tracking
  - Online status tracking
  - Case-insensitive username and email indexing
  - Extended user profile with roles and activity timestamps
- Improved Message System:
  - Message ownership verification
  - Enhanced privacy controls for message access
  - Restricted message viewing to owners and super users
- API Documentation:
  - Enhanced Swagger documentation with authentication details
  - Improved API operation descriptions
  - Added security requirements to API endpoints
- Monitoring and Logging:
  - Request logging middleware for debugging
  - Detailed request information logging (URL, method, headers)
- Database Improvements:
  - Added indexes for case-insensitive searches
  - Optimized database queries
  - Added unique constraints for username and email

### Security

- Enhanced message access control with ownership verification
- Added role-based authorization for sensitive operations
- Implemented JWT-based secure authentication
- Added case-sensitive email and username validation

### Changed

- Updated user schema with new fields (email, roles, lastActive, isOnline)
- Modified message access to require authentication
- Enhanced error handling with specific error messages
- Updated API endpoints to include authentication requirements

## [0.0.1] - 2025-04-12

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
