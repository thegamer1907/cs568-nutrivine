# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

ARG MONGO_URL=defaultValue

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the application will listen on
EXPOSE 3000

# Start the application
CMD [ "npm", "run","dev" ]
