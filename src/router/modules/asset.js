import trading from '@/views/wallet/trading'
import topup from '@/views/wallet/topup/topup'
import withdrawal from '@/views/wallet/withdrawal/withdrawal'
import withdrawalSelect from '@/views/wallet/withdrawal/withdrawal-select'
import addressManage from '@/views/wallet/address/address-manage'
import address from '@/views/wallet/address/address'
import addAddress from '@/views/wallet/address/add-address'
import topupSelect from '@/views/wallet/topup/topup-select'
import walletDetail from '@/views/wallet/wallet-detail'

export default [
    {
        path: 'trading',
        name: 'trading',
        component: trading,
        meta: {login: true, nav:true}
    },
    {
        path: 'wallet-detail',
        name: 'wallet-detail',
        component: walletDetail,
        meta: {login: true}
    },
    {
        path: 'address-manage',
        name: 'address-manage',
        component: addressManage,
        meta: {login: true}
    },
    {
        path: 'address',
        name: 'address',
        component: address,
        meta: {login: true}
    },
    {
        path: 'add-address',
        name: 'add-address',
        component: addAddress,
        meta: {login: true}
    },
    {
        path: 'topup-select', // 选择充值
        name: 'topup-select',
        component: topupSelect,
        meta: {login: true}
    },
    {
        path: 'topup', // 充值
        name: topup.name,
        component: topup,
        meta: {login: true}
    },
    {
        path: 'withdrawal-select', //
        name: 'withdrawal-select',
        component: withdrawalSelect,
        meta: {login: true}
    },
    {
        path: 'withdrawal', //
        name: 'withdrawal',
        component: withdrawal,
        meta: {login: true}
    },
    {
        path: 'wallet/history',
        name: 'history',
        component: () => import('@/views/wallet/history/history-list'),
        meta:{login:true}
    },
    {
        path: 'wallet/history-detail',
        name: 'history-detail',
        component: () => import('@/views/wallet/history/history-detail'),
        meta:{login:true}
    },
]
