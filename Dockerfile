# Step 1: Build the React application
FROM node:18 AS build
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile
COPY . ./
EXPOSE 3000
CMD ["yarn", "start"]
# RUN npm run build

# # Step 2: Serve the application using a server like nginx
# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# ---------------------------------------------------------------------------- #

# FROM node:18 AS build
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . ./
# RUN npm run build

# FROM node:18
# WORKDIR /app
# COPY --from=build /app/build ./build
# RUN npm install -g serve
# EXPOSE 3000
# CMD ["serve", "-s", "build", "-l", "3000"]
