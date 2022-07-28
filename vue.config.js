/**
 * Override convention configuration
 * https://cli.vuejs.org/config/
 */

module.exports = {
  // relative path for dev
  publicPath: process.env.NODE_ENV === "production" ? "/edu-boss/" : "/",
  // for gh-pages
  indexPath: "index.html",
  assetsDir: "assets",
  lintOnSave: process.env.NODE_ENV !== "production",
  productionSourceMap: false,
  css: {
    // sourceMap: process.env.NODE_ENV !== 'production'
  },
  devServer: {
    open: true,
    port: 8082
  }
};
