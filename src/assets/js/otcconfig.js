import otcApi from '@/api/otc'

let config = {
  symbol: 'ETH',
  adsTypes: [
    {id: 1, key: 'otc_exchange.otc_exchange_buy', name: '购买'},
    {id: 2, key: 'otc_exchange.otc_exchange_sell', name: '出售'}
  ],
  currencys: [],
  coins: [],
  payments: [
    {id: 4, key: 'otc_ad.otc_ad_PayPal', name: 'PayPal支付', className: 'paypal icon-paypal', checked: false},
    {id: 3, key: 'otc_ad.otc_ad_WeChatPay', name: '微信支付', className: 'wechat icon-wechat', checked: false},
    {id: 2, key: 'otc_ad.otc_ad_Alipay_pay', name: '支付宝支付', className: 'alipay icon-alipay', checked: false},
    {id: 1, key: 'otc_ad.otc_ad_BankPay', name: '银行卡支付', className: 'bank icon-bank', checked: false}
  ],
  additional: [
    {symbol: 'ATN', price: 0.1},{symbol: 'MECoin', price: 0.25},
  ]
}
otcApi.getCoinsList((res) => {
  res.forEach((item) => {
    config.coins.push(item)
  })
})
otcApi.getCurrencys((res) => {
  res.forEach((item) => {
    config.currencys.push({
      id: item.id,
      name: item.currencyCn,
      value: item.currency,
      text: `otc_exchange.otc_exchange_${item.currency}`,
      minLimit: item.minLimit
    })
  })
})

export default config
