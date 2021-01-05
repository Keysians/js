module.exports = {
  productionSourceMap: process.env.NODE_ENV != 'production',
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  },
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  }
}
