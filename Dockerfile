FROM oven/bun:canary-debian AS build

WORKDIR /app

COPY . .

RUN bun install
RUN bun run build

FROM nginx:1.27.5

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
