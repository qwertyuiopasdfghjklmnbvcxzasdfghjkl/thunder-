export default [
	{
	  path: '/otc/',
	  name: 'otc',
	  component: () => import('@/views/otc/')
	},
	{
	  path: '/otc/update/:orderId?',
	  name: 'otcAddOrUpdate',
	  component: () => import('@/views/otc/createorder'),
	  meta: {login: true}
	},
	

]
