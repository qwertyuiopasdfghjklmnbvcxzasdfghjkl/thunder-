let domain = process.env.NODE_ENV === 'development' ? 'thunder-test.lab.ssss.so' : location.host.split(':')[0]
// let domain = process.env.NODE_ENV === 'development' ? 'ltpro.vip' : location.host.split(':')[0]

if (process.env.VUE_APP_BASEURL) {
  domain = process.env.VUE_APP_BASEURL
}
let https = window.location.protocol === 'https:'?true:false
if (process.env.VUE_APP_HTTPS==='true') {
  https = true
}
const protocol = window.location.protocol === 'https:' || https ? 'wss://': 'ws://'
const http = window.location.protocol === 'https:' || https ? 'https://' : 'http://'
const config = {
  domain: domain,
  imageType: /\.(jpg|png|jpeg|bmp)/i,
  http: http,
  url: `${http}${domain}`,
  protocol: protocol,
  brand: 'Thunder',
  version:'1.0.0',
  updateInfo:{  //更新日志
  	'zh-CN':`
    <p class="tl">1. 优化接口数据请求策略</p>
    `,
  	'en':`
    <p class="tl">1. Optimize interface data request strategy</p>
    `
  }
}

export default config
