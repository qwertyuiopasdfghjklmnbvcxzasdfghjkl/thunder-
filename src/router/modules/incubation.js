export default [
	{
		path: '/incubation',
		name: 'incubation',
		component: () => import('@/views/incubation/')
	},
	{
		path: '/incubation/staked_history',
		name: 'stakedHistory',
		component: () => import('@/views/incubation/staked_history')
	},
	{
		path: '/incubation/staked_detail',
		name: 'stakedDetail',
		component: () => import('@/views/incubation/staked_detail')
	},
	{
		path: '/incubation/transfer',
		name: 'transfer',
		component: () => import('@/views/incubation/transfer')
	}
]
