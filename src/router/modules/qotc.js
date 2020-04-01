export default [
    {
        path: '/qotc/:type(1|2)?',
        name: 'qotc',
        component: () => import('@/views/qotc/index'),
        meta: {login: true}
    },
    {
        path: '/qotc/publish/:orderId?',
        name: 'qotcAddOrUpdate',
        component: () => import('@/views/qotc/publish_advertisement'),
        meta: {login: true}
    },
    {
        path: '/qotc/order/:orderId',
        name: 'orderDetail',
        component: () => import('@/views/qotc/order_detail'),
        meta: {login: true}
    },
    {
        path: '/qotc/appeal/:orderNumber',
        name: 'qotcAppeal',
        component: () => import('@/views/qotc/appeal'),
        meta: {login: true}
    },
    {
        path: '/qotc/manage',
        name: 'qotcManage',
        component: () => import('@/views/qotc/manage'),
        meta: {login: true}
    },
    {
        path: '/qotc/orders',
        name: 'qotcOrders',
        component: () => import('@/views/qotc/order_list'),
        meta: {login: true}
    },

]
