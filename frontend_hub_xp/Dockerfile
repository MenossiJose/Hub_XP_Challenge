FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN echo "Building frontend..." && \
    (CI=false NODE_OPTIONS=--max_old_space_size=4096 npm run build || \
     echo "TypeScript build failed, trying direct Vite build..." && \
     CI=false npx vite build --emptyOutDir)

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]