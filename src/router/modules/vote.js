export default [
	{
	  path: '/vote',
	  name: 'vote',
	  component: () => import('@/views/vote/')
	},
	{
	  path: '/vote/rules/:type',
	  name: 'voteRules',
	  component: () => import('@/views/vote/rules')
	},
	{
	  path: '/vote/detail/:id',
	  name: 'voteDetail',
	  component: () => import('@/views/vote/detail'),
	  meta:{login: true}
	},
]
