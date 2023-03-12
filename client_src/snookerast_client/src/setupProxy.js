const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true
}
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware(proxy)
  );
};

// NOTE: If adding a new component and fetch is not routing to the correct proxy
// then try deleting package-lock.json and node_modules/ then reinstalling with npm i
