FROM node:12.18.3-alpine3.12
# LABEL author="masb0ymas"

# Setup Timezone
RUN	apk add tzdata
ENV TZ=Asia/Jakarta

RUN apk add nano

# Bundle app source
COPY . /var/www
# Create app directory
WORKDIR /var/www

# Install PM2
RUN npm install pm2 -g

# Install app dependencies
RUN yarn
RUN npm run build

# EXPOSE 8080
CMD ["npm", "run", "serve:production-docker"]
