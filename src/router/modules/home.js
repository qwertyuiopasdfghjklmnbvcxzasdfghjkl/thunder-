export default [
	{
		path: '/notice',
		name: 'notice',
		component: () => import('@/views/home/notice/notice-list')
	},
	{
		path: '/notice-detail',
		name: 'notice-detail',
		component: () => import('@/views/home/notice/notice-detail')
	},
	{
	  path: '/sendemail/:email',
	  name: 'sendemail',
	  component: () => import('@/views/email/activation')
	},
	{
	  path: '/activationsuccess',
	  name: 'activationsuccess',
	  component: () => import('@/views/email/activationsuccess')
	},
	{
	  path: '/withdrawsuccess',
	  name: 'withdrawsuccess',
	  component: () => import('@/views/email/withdrawsuccess')
	},
	{
      path: '/linkinvalid',
      name: 'linkinvalid',
      component: () => import('@/views/email/linkinvalid')
    },
]
