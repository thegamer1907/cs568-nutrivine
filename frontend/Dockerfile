# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:20 as build

# Set the working directory
WORKDIR /app

# Add the source code to app
COPY ./ ./

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build

# Expose port 80
EXPOSE 80

# Start the application
CMD [ "npm", "run" ,"dev" ]