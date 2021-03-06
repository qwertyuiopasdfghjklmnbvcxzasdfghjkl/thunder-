export default [
    {
        path: '/market',
        name: 'market',
        component: () => import('@/views/market/index'),
        meta: {nav: true}
    },
    {
        path: '/market/kline/:market?',
        name: 'kline',
        component: () => import('@/views/exchange/kline'),
    },
    {
        path: '/market/exchange',
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
    {
        path: '/market/deal-list',
        name: 'exchangeDealList',
        component: () => import('@/views/exchange/deal-list/dealList'),
    },
]
