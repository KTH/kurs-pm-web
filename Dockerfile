FROM kthse/kth-nodejs:16.0.0

LABEL maintainer="KTH-studadm studadm.developers@kth.se"

WORKDIR /application
ENV NODE_PATH /application

ENV TZ Europe/Stockholm

COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]

COPY ["config", "config"]
COPY ["i18n", "i18n"]
COPY ["public", "public"]
COPY ["server", "server"]

COPY ["app.js", "app.js"]
COPY ["build.sh", "build.sh"]
COPY ["webpack.config.js", "webpack.config.js"]
COPY [".babelrc", ".babelrc"]
# Config for jest tester
COPY ["babel.config.js", "babel.config.js"]
COPY ["jest.config.js", "jest.config.js"]


RUN apk stats && \
  chmod a+rx build.sh && \
  apk add --no-cache bash && \
  apk add --no-cache --virtual .gyp-dependencies python2 make g++ util-linux && \
  npm ci --unsafe-perm && \
  npm run build && \
  npm prune --production && \
  apk del .gyp-dependencies && \
  apk stats

EXPOSE 3000

CMD ["npm", "start"]
