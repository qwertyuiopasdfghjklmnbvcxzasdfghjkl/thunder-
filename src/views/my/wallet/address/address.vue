<template>
    <div class="page">
        <top-back>
            {{symbol}} {{$t('home.address')}}
        </top-back>
        <div class="page-main">
            <div class="list full" v-show="list.length">
                <ul>
                    <li v-for="item in list" v-tap="{methods:action, item:item}">
                        <i>
                            <img src="../../../../assets/img/address.png">
                        </i>
                        <label>
                            <p><strong>{{item.memo}}</strong></p>
                            <p class="f24 mt10 ft-c-lightGray">{{item.address}}</p>
                        </label>
                        <span class="mint-radio-core radio" v-if="from==='withdrawal' && list.length" :class="{active:item.withdrawId===data.withdrawId}"></span>
                        <span class="allow-right" v-else></span>
                    </li>
                </ul>
            </div>
            <no-data v-show="!list.length"></no-data>
            <div class="bottom">
                <mt-button type="primary" size="large" :disabled="!data.address" v-tap="{methods: setAddress}" v-if="from==='withdrawal' && list.length"> {{$t('user.confirmChioce')}} </mt-button>
                <mt-button type="primary" size="large" v-tap="{methods: addAddress}" v-else> {{$t('home.add-address')}} </mt-button>
            </div>
        </div>
        <div :class="{'popup':show}">
            <div class="popup_cont" :class="{'show':show}">
                <label>
                    <p v-clipboard:copy="data.address" v-clipboard:success="onCopy" v-clipboard:error="onError">
                        {{$t('home.copy')}}</p>
                    <p v-tap="{methods: del}">{{$t('home.delete')}}</p>
                </label>
                <label>
                    <p v-tap="{methods:()=>{show=false}}">{{$t('home.home37')}}</p>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    import wallet from '../../../../api/wallet'
    import NoData from "../../../../components/common/noData";
    import {mapGetters} from 'vuex'

    export default {
        components: {NoData},
        data() {
            return {
                symbol: null,
                list: [],
                show: false,
                from:'',
                data: {},
                withdrawId:'',
            }
        },
        computed:{
            ...mapGetters(['getSymbol']),
        },
        created() {
            this.symbol = this.getSymbol
            this.from = this.$route.params.from || ''
            this.getAddressList()
        },
        methods: {
            setAddress(){
                this.$router.replace({name: 'withdrawal', params:{address:this.data.address}})
            },
            action(args){
                this.data = args.item
                if(this.from!=='withdrawal'){
                    this.show = true;
                }
            },
            getAddressList() {
                wallet.addressList({symbol: this.symbol}, res => {
                    // console.log(res)
                    this.list = res
                })
            },
            onCopy() {
                Tip({type: 'success', message: this.$t('public0.public33')})
                this.show = false
            },
            onError() {
                Tip({type: 'danger', message: this.$t('home.copy-error')})
                this.show = false
            },
            del() {
                wallet.deleteAddress(this.data.withdrawId, res => {
                    Tip({type: 'success', message: res.msg})
                    this.getAddressList()
                    this.show = false
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
                    this.show = false
                })
            },
            addAddress() {
                this.$router.push({name: 'add-address'})
            }
        }
    }
</script>

<style scoped lang="less">
    .page-main {
        padding-bottom: 1.6rem;
    }

    .list {
        ul {
            background: #fff;
            padding: 0 0.3rem;
            margin-top: 0.3rem;

            li {
                padding: 0.24rem 0;
                display: flex;
                position: relative;
                &+li {border-top: 0.02rem solid #eee;}

                i {
                    width: 0.54rem;
                    flex: 1;
                    flex-shrink: 0;

                    img {
                        width: 0.54rem;
                        height: 100%;
                        object-fit: contain;
                        object-position: center;
                    }
                }

                label {
                    flex-shrink: 1;
                    width: 6.1rem;
                    p { padding-right: 0.6rem;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .radio {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .mint-radio-core.active {
                    background-color: #3B48C8;
                    border-color: #3B48C8;
                    &:after {
                        background-color: #fff;
                        -webkit-transform: scale(1);
                        transform: scale(1);
                    }
                }
            }
        }
    }

    

    .popup {
        position: fixed;
        height: 100vh;
        width: 100vw;
        background: rgba(0,0,0, 0.3);
    }

    .popup_cont {
        position: fixed;
        width: 100vw;
        bottom: -4rem;
        left: 0;
        text-align: center;
        z-index: 99;
        transition: 0.3s;
        padding: 0.48rem;

        label {
            display: block;
            border-radius: 0.2rem;
            background: #ffffff;
            margin-bottom: 0.2rem;

            p {
                height: 0.9rem;
                line-height: 0.9rem;
                border-bottom: 0.02rem solid #eee;
                color: #191919;
                font-size: 0.3rem;

                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }

    .show {
        bottom: 0 !important;
    }
    .bottom {
        position: fixed;
        bottom: 0.5rem;
        left: 0.3rem;
        right: 0.3rem;
    }
</style>
