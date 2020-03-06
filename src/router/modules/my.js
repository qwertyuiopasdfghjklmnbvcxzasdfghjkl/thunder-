// import My from '@/views/my/index'

import error from '../../views/error'
import success from '../../views/success'

export default [
    {
        path: '/ucenter',
        name: 'my',
        redirect: '/ucenter/index',
        component:() => import('@/views/my'),
        children:[
            {
                path: 'index',
                name: 'ucenter',
                component:() => import('@/views/my/my'),
                meta:{login:true}
            },
            {
                path: 'kyc',
                name: 'kyc',
                component:() => import('@/views/my/center/kyc'),
                meta:{login: true}
            },
            {
                path: 'realnameInfo',
                name: 'realnameInfo',
                component:() => import('@/views/my/center/realnameInfo'),
                meta:{login: true}
            },
            {
                path: 'otherRealnameInfo',
                name: 'otherRealnameInfo',
                component:() => import('@/views/my/center/otherRealnameInfo'),
                meta:{login: true}
            },
            {
                path: 'message',
                name: 'message',
                component:() => import('@/views/my/message/message'),
                meta:{login: true}
            },
            {
                path: 'set',
                name: 'set',
                component:() => import('@/views/my/set/set'),
            },
            {
                path: 'set-lang',
                name: 'set-lang',
                component:() => import('@/views/my/set/set-lang'),
            },
            {
                path: 'set-payway',
                name: 'set-payway',
                component:() => import('@/views/my/set/set-payway'),
                meta:{login: true}
            },
            {
                path: 'bank-pay',
                name: 'bank-pay',
                component:() => import('@/views/my/set/bank'),
                meta:{login: true}
            },
            {
                path: 'wechat-pay',
                name: 'wechat-pay',
                component:() => import('@/views/my/set/wechat'),
                meta:{login: true}
            },
            {
                path: 'alipay-pay',
                name: 'alipay-pay',
                component:() => import('@/views/my/set/alipay'),
                meta:{login: true}
            },
            {
                path: 'paypal-pay',
                name: 'paypal-pay',
                component:() => import('@/views/my/set/paypal'),
                meta:{login: true}
            },
            {
                path: 'safe',
                name: 'safe',
                component:() => import('@/views/my/safe/safety'),
                meta:{login: true}
            },
            {
                path: 'google-verify',
                name: 'google-verify',
                component:() => import('@/views/my/safe/google-verify'),
                meta:{login: true}
            },
            {
                path: 'resetPW',
                name: 'resetPW',
                component:() => import('@/views/my/safe/reset-password'),
                meta:{login: true}
            },
            {
                path: 'phone-verify',
                name: 'phoneVerify',
                component:() => import('@/views/my/safe/phone-verify'),
                meta:{login: true}
            },
            {
                path: 'about',
                name: 'about',
                component:() => import('@/views/my/about/about'),
            },
            {
                path: 'about-bar',
                name: 'about-bar',
                component:() => import('@/views/my/about/bar'),
            },
            {
                path: 'center',
                name: 'center',
                component:() => import('@/views/my/center/center'),
                meta:{login: true}
            },

            {
                path: 'referral',
                name: 'referral',
                component: () => import('@/views/my/referral'),
                meta:{login:true}
            },
            {
                path: 'stake',
                name: 'stake',
                component: () => import('@/views/my/stake'),
                meta:{login:true}
            },
            {
                path: 'mapping-records',
                name: 'mappingRecords',
                component: () => import('@/views/my/mapping'),
                meta:{login:true}
            },
            {
                path: 'my-mapping',
                name: 'myMapping',
                component: () => import('@/views/my/mapping/my-mapping'),
                meta:{login:true}
            },
            {
                path: 'to-map',
                name: 'toMap',
                component: () => import('@/views/my/mapping/to-map'),
                meta:{login:true}
            },
            {
                path: 'trans-records',
                name: 'transRecords',
                component: () => import('@/views/my/trans/'),
                meta:{login:true}
            },
            {
                path: 'trans-detail',
                name: 'transDetail',
                component: () => import('@/views/my/trans/detail'),
                meta:{login:true}
            },
            {
                path: 'online',
                name: 'online',
                component: () => import('@/views/my/online'),
                meta:{login:true}
            },
            {
                path: 'invite-poster',
                name: 'invitePoster',
                component: () => import('@/views/my/invite_poster'),
                meta:{login:true}
            },
        ]
    },
    {
        path: '/error',
        name: 'error',
        component: error
    },
    {
        path: '/success',
        name: 'success',
        component: success
    },
]
