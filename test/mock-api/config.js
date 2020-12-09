module.exports = {
  host: {
    address: '0.0.0.0',
    port: 3000
  },
  paths: [
    {
      url: '/kurs-pm/_checkAPIkey',
      response: 'Response from kurs-pm checkAPIkey'
    },
    {
      url: '/kurs-pm/_paths',
      response: { api: [] }
    },
    {
      url: '/kursinfo/_checkAPIkey',
      response: 'Response from kursinfo checkAPIkey'
    },
    {
      url: '/kursinfo/_paths',
      response: { api: [] }
    },
    {
      url: '/kursplan/_checkAPIkey',
      response: 'Response from kursplan checkAPIkey'
    },
    {
      url: '/kursplan/_paths',
      response: { api: [] }
    }
  ]
}
