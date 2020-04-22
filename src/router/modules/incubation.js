export default [
	{
		path: '/incubation/detail/:token',
		name: 'incubationDetail',
		component: () => import('@/views/incubation/incubation_detail'),
		meta:{login:true}
	},
	{
		path: '/incubation/staked_history',
		name: 'stakedHistory',
		component: () => import('@/views/incubation/staked_history'),
		meta:{login:true}
	},
	{
		path: '/incubation/staked_detail/',
		name: 'stakedDetail',
		component: () => import('@/views/incubation/staked_detail'),
		meta:{login:true}
	},
	{
		path: '/incubation/staked_trans_detail/',
		name: 'stakedTransDetail',
		component: () => import('@/views/incubation/staked_trans_detail'),
		meta:{login:true}
	},
	{
		path: '/incubation/transfer/:token',
		name: 'transfer',
		component: () => import('@/views/incubation/transfer'),
		meta:{login:true}
	},
	{
		path: '/incubation/:token?',
		name: 'incubation',
		component: () => import('@/views/incubation/'),
		meta:{login:true}
	},
]
