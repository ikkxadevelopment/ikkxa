# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining files into the container
COPY . .

# Expose the port your app will run on
EXPOSE 3001

# Set the command to run the app
CMD ["npm", "start"]


