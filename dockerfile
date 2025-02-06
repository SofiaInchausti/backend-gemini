FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# If using TypeScript, compile the code 
RUN npx tsc

# Stage 2: Final image for production
FROM node:18-alpine

WORKDIR /app

# Set the working directory
COPY package*.json ./
RUN npm install --only=production

# Copy only the necessary files for production
COPY --from=builder /app/dist ./dist

# Expose the port used by your application (adjust the number as needed)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
