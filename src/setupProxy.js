const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use("/api", // 由于请求前后端此时都为3000端口，由于区分请求后端的前缀
    createProxyMiddleware({
      target: "http://localhost:8081",// 后端服务器地址
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      } // 重写地址，将附加的api前缀去除给到后端地址
      // 若后端请求地址为 http://127.0.0.1:8080/myprocess/
      // 此时请求代理服务器地址应为 http://127.0.0.1:8080/api/myprocess/
      // 此处选项就是去除api/这个前缀的
    }))
};
