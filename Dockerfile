# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install bash, git, etc. for development
RUN apk add --no-cache bash git

# Default command
CMD ["sh"]