# Step 1: Use Node.js image to build the app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Use a lightweight web server to serve the built app
FROM nginx:alpine

# Copy the built app to the Nginx web directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
