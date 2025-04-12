# Anonymous Message API

A secure and scalable REST API built with NestJS for sending and receiving anonymous messages.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/yourusername/anonymous-message-api/issues)

## Features

- 🔒 **Robust Security**

  - Helmet for HTTP security headers
  - CORS protection with configurable origins
  - Cookie parser integration
  - Request compression

- 🚀 **API Features**

  - URI-based versioning (api/v1)
  - Global request validation
  - Automatic data transformation
  - Comprehensive error handling

- 📚 **API Documentation**
  - Interactive Swagger UI (available in non-production)
  - Bearer token authentication support
  - Detailed endpoint documentation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A running instance of your preferred database

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/anonymous-message-api.git

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The application will start on the configured port (default: 3000).

## API Documentation

When running in development mode, you can access the Swagger documentation at:

```
http://localhost:3000/docs
```

## Security

This application implements several security best practices:

- Strict CORS policy with configurable origins
- Limited HTTP methods
- Secure headers with Helmet
- Request rate limiting
- Input validation and sanitization

## Validation

All incoming requests are validated using NestJS pipes with the following settings:

- Whitelist validation
- Automatic data transformation
- Strict type checking
- Unknown property rejection

## Development

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint

# Run formatting
npm run format
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/). For the versions available, see the [CHANGELOG.md](CHANGELOG.md).

## Contributing

We love your input! We want to make contributing to Anonymous Message API as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

### We Develop with Github

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

### Report bugs using Github's [issue tracker](https://github.com/yourusername/anonymous-message-api/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/anonymous-message-api/issues/new); it's that easy!

### Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### License

By contributing, you agree that your contributions will be licensed under its MIT License.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you found this project useful, please consider giving it a ⭐️ on Github and sharing it with your friends!
