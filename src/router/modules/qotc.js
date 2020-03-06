export default [
	{
	  path: '/qotc/:type(1|2)?',
	  name: 'qotc',
	  component: () => import('@/views/qotc/index')
	},
	{
	  path: '/qotc/publish/:orderId?',
	  name: 'qotcAddOrUpdate',
	  component: () => import('@/views/qotc/publish_advertisement'),
	  meta: {login: true}
	},
	{
	  path: '/qotc/order/:orderId?',
	  name: 'orderDetail',
	  component: () => import('@/views/qotc/order_detail'),
	  meta: {login: true}
	},

]
