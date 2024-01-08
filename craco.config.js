const path = require('path')

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    }
  },

  devServer: {
    client: {
      //当出现编译错误或警告时，在浏览器中是否显示全屏覆盖。  示例为只显示错误信息
      overlay: {
        errors: false,
        warnings: false
      },
    },
  },
}


