module.exports = {
  proxyList: {
    '/api-auth/': {
      target: 'http://gicdev.demogic.com/api-auth/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-auth': ''
      }
    },
    '/api-admin/': {
      target: 'http://gicdev.demogic.com/api-admin/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-admin': ''
      }
    },
    '/api-plug/': {
      target: 'http://gicdev.demogic.com/api-plug/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-plug': ''
      }
    },
    '/api-mall/': {
      target: 'http://gicdev.demogic.com/api-mall/',
      changeOrigin: true,
      pathRewrite: {
        '^/api-mall': ''
      }
    }
  }
}
