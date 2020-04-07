module.exports = {
  assetsDir: 'static',
  baseUrl: '',
  outputDir: "www",
  runtimeCompiler: undefined,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,
  devServer: {
    hotOnly: false,
    open: true,
    proxy:{
      "/api":{
        target: 'http://ltpro-pre.ssss.so',//这里后台的地址模拟的;应该填写你们真实的后台接口
        ws: true,
        changOrigin: true,//允许跨域
        pathRewrite: {
          '^/api': ''//请求的时候使用这个api就可以
        }
      }
    }
  }
}
