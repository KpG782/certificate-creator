# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Optional: custom nginx config (if needed) could be added here
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]