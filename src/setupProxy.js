const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use("/api",
    createProxyMiddleware({
      target: "http://3.25.98.192:8081",
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      }
    }))
};
