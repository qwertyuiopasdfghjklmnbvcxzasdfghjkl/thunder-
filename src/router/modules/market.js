export default [
    {
        path: '/market/kline/:market?',
        name: 'kline',
        component: () => import('@/views/exchange/kline'),
    },
    {
        path: '/market/exchange/:market?',
        name: 'exchange',
        component: () => import('@/views/exchange/exchange'),
        meta: {nav: true}
    },
    {
        path: '/market/now-deal',
        name: 'now-deal',
        component: () => import('@/views/exchange/now-deal'),
        meta: {login: true}
    },
    {
        path: '/market/history-deal',
        name: 'history-deal',
        component: () => import('@/views/exchange/history-deal'),
        meta: {login: true}
    },
    {
        path: '/market/full-screen/:market?',
        name: 'full-screen',
        component: () => import('@/views/exchange/kline/full-screen'),
    },
    {
        path: '/market/last-deal/:symbol',
        name: 'lastDeal',
        component: () => import('@/views/exchange/last-deal')
    },
]
