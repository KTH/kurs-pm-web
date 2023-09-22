/**
 *
 *            Server specific settings
 *
 * *************************************************
 * * WARNING! Secrets should be read from env-vars *
 * *************************************************
 *
 */
const {
  getEnv,
  devDefaults,
  unpackRedisConfig,
  unpackNodeApiConfig,
  unpackKOPPSConfig,
} = require('kth-node-configuration')

// DEFAULT SETTINGS used for dev, if you want to override these for you local environment, use env-vars in .env
const devPort = devDefaults(3000)
const devSsl = devDefaults(false)
const devUrl = devDefaults('http://localhost:' + devPort)
const devKursPmDataApi = devDefaults('http://localhost:3001/api/kurs-pm-data?defaultTimeout=10000')
const devKursInfoApi = devDefaults('http://localhost:3002/api/kursinfo?defaultTimeout=10000')
const devKursplanApi = devDefaults('http://localhost:3003/api/kursplan?defaultTimeout=10000')
const devKoppsApi = devDefaults('https://api-r.referens.sys.kth.se/api/kopps/v2/?defaultTimeout=10000')
const devSessionKey = devDefaults('kurs-pm-web.sid')
const devSessionUseRedis = devDefaults(true)
const devRedis = devDefaults('redis://localhost:6379/')
// END DEFAULT SETTINGS

module.exports = {
  hostUrl: getEnv('SERVER_HOST_URL', devUrl),
  useSsl: String(getEnv('SERVER_SSL', devSsl)).toLowerCase() === 'true',
  port: getEnv('SERVER_PORT', devPort),
  ssl: {
    // In development we don't have SSL feature enabled
    pfx: getEnv('SERVER_CERT_FILE', ''),
    passphrase: getEnv('SERVER_CERT_PASSPHRASE', ''),
  },

  // API keys
  apiKey: {
    kursPmDataApi: getEnv('KURS_PM_DATA_API_KEY', devDefaults('1234')),
    kursInfoApi: getEnv('KURS_INFO_API_KEY', devDefaults('1234')),
    kursplanApi: getEnv('KURSPLAN_API_KEY', devDefaults('5678')),
  },

  // Service API's
  nodeApi: {
    kursPmDataApi: unpackNodeApiConfig('KURS_PM_DATA_API_URI', devKursPmDataApi),
    kursInfoApi: unpackNodeApiConfig('KURS_INFO_API_URI', devKursInfoApi),
    kursplanApi: unpackNodeApiConfig('KURSPLAN_API_URI', devKursplanApi),
  },

  // koppsApi: unpackKOPPSConfig('KOPPS_URI', devKoppsApi),
  koppsApi: unpackNodeApiConfig('KOPPS_URI', devKoppsApi),

  // Cortina
  blockApi: {
    blockUrl: getEnv('CM_HOST_URL', devDefaults('https://app-r.referens.sys.kth.se/cm/')), // Block API base URL
    addBlocks: {
      studentSecondaryMenu: '1.1066515',
      studentMegaMenu: '1.1066510',
      studentSearch: '1.1066521',
      studentFooter: '1.1066523',
    },
  },

  // Logging
  logging: {
    log: {
      level: getEnv('LOGGING_LEVEL', 'debug'),
    },
    accessLog: {
      useAccessLog: String(getEnv('LOGGING_ACCESS_LOG', true)).toLowerCase() === 'true',
    },
  },
  clientLogging: {
    level: 'debug',
  },
  cache: {
    cortinaBlock: {
      redis: unpackRedisConfig('REDIS_URI', devRedis),
    },
  },

  // Session
  sessionSecret: getEnv('SESSION_SECRET', devDefaults('1234567890')),
  session: {
    key: getEnv('SESSION_KEY', devSessionKey),
    useRedis: String(getEnv('SESSION_USE_REDIS', devSessionUseRedis)).toLowerCase() === 'true',
    sessionOptions: {
      // do not set session secret here!!
      cookie: {
        secure: String(getEnv('SESSION_SECURE_COOKIE', false)).toLowerCase() === 'true',
        path: getEnv('SERVICE_PUBLISH', '/kurs-pm'),
        sameSite: getEnv('SESSION_SAME_SITE_COOKIE', 'Lax'),
      },
      proxy: String(getEnv('SESSION_TRUST_PROXY', true)).toLowerCase() === 'true',
    },
    redisOptions: unpackRedisConfig('REDIS_URI', devRedis),
  },

  // APPLICATION INSIGHTS IN AZURE
  appInsights: {
    instrumentationKey: getEnv('APPINSIGHTS_INSTRUMENTATIONKEY', ''),
  },
}
