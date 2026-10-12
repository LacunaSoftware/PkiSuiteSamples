// The Angular dev server (npm start) forwards the API calls to the ASP.NET Core server. When
// SpaProxy starts the dev server, it inherits the server's ASPNETCORE_* variables.
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:5100';

const PROXY_CONFIG = [
  {
    context: [
      '/api',
    ],
    target,
    secure: false
  }
];

module.exports = PROXY_CONFIG;
