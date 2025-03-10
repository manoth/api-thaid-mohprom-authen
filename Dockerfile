FROM node:16-alpine

# ตั้งค่าไดเรกทอรีทำงานใน container
WORKDIR /home/api

# อัพเดตและติดตั้ง dependencies ที่จำเป็นในหนึ่งคำสั่งเดียว
RUN apk update && apk upgrade && apk add --no-cache \
    alpine-sdk \
    git \
    openssh \
    python3 \
    tzdata \
    build-base \
    libtool \
    autoconf \
    automake \
    gzip \
    g++ \
    make \
    screen && \
    cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
    echo "Asia/Bangkok" > /etc/timezone

# คัดลอกโค้ดทั้งหมดไปยัง container
COPY . /home/api

ENV PORT=3000 \
    RADIUS_TYPE=mysql \
    RADIUS_HOST=localhost \
    RADIUS_USERNAME=radius \
    RADIUS_PASSWORD=password \
    RADIUS_DBNAME=radius \
    RADIUS_CHARSET=utf8 \
    RADIUS_PORT=3306 \
    RADIUS_CHARSET=utf8 \
    RADIUS_TIMEZONE=UTC \
    FORTIGATE_URL=http://localhost:1000 \
    THAID_CLIENT_ID=xxx \
    THAID_CLIENT_SECRET=xxxx \
    MOPH_SECRET_KEY=xxxx \
    MOPH_HOSPCODE=00000 \
    MOPH_USERNAME=xxxx \
    MOPH_PASSWORD=xxxx \
    CHAR=abcdefghijklmnopqrstuvwxyz0123456789 \
    CHAR_NUM=0123456789

# ติดตั้ง dependencies
RUN npm i && npm install pm2 -g

# เปิดพอร์ตที่ต้องการใช้งาน
EXPOSE 3000

# รันคำสั่งเพื่อเริ่มโปรเจ็กต์
CMD ["pm2-runtime", "pm2.json"]