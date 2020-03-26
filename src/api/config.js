let domain = process.env.NODE_ENV === 'development' ? 'thunder-test.lab.ssss.so' : location.host.split(':')[0]
// let domain = process.env.NODE_ENV === 'development' ? 'ltpro.vip' : location.host.split(':')[0]


if (process.env.VUE_APP_BASEURL) {
  domain = process.env.VUE_APP_BASEURL
}
let https = window.location.protocol === 'https:'?true:false
if (process.env.VUE_APP_HTTPS==='true') {
  https = true
}
let dev = process.env.NODE_ENV === 'development'
const protocol = window.location.protocol === 'https:' || https ? 'wss://': 'ws://'
const http = window.location.protocol === 'https:' || https ? 'https://' : 'http://'
const config = {
  domain: domain,
  imageType: /\.(jpg|png|jpeg|bmp)/i,
  http: http,
  url: `${http}${domain}`,
  protocol: protocol,
  headUrl: dev  ? `${http}${domain}/ceph-data/dev/user/` : `${http}${domain}/ceph-data/produ-thunder/user/`,
  brand: 'Thunder',
  version:'1.0.0',
  updateInfo:{  //更新日志
  	'zh-CN':`
    <p class="tl">1. 优化部分页面界面显示</p>
    <p class="tl">2. 优化内部转账功能</p>
    `,
  	'en':`
    <p class="tl">1. Optimize partial page interface display</p>
    <p class="tl">2. Optimize internal transfer function</p>
    `
  }
}

export default config
