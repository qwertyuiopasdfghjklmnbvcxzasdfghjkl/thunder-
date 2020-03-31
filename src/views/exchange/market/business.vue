<template>
    <div class="left">
        <!--<div class="acBtns">-->
        <!--&lt;!&ndash;<button type="button" class="buy" :class="{active:isBuy}" @click="switchTradeType('buy')">&ndash;&gt;-->
        <!--&lt;!&ndash;{{$t('exchange.exchange_buy')}}&lt;!&ndash;买入&ndash;&gt;</button>&ndash;&gt;-->
        <!--&lt;!&ndash;<button type="button" class="sell" :class="{active:!isBuy}" @click="switchTradeType('sell')">&ndash;&gt;-->
        <!--&lt;!&ndash;{{$t('exchange.exchange_sell')}}&lt;!&ndash;卖出&ndash;&gt;</button>&ndash;&gt;-->
        <!--</div>-->
        <div class="trust-type-choice">
            <span @click="toggleChoice">{{$t(entrustType=='market'?'exchange.exchange_market':'exchange.exchange_limit')}}</span>
            <transition enter-active-class="animated short fadeIn" leave-active-class="animated short fadeOut">
                <ul class="choices" v-show="isTrustChioce">
                    <li @click="toggleChoice('limit')" :class="{active:entrustType==='limit'}">
                        {{$t('exchange.exchange_limit')}}<!--限价委托--></li>
                    <li @click="toggleChoice('market')" :class="{active:entrustType==='market'}" v-show="symbol!==mainMarket">
                        {{$t('exchange.exchange_market')}}<!--市价委托--></li>
                </ul>
            </transition>
        </div>
        <cp-adjust v-model="formData.price" v-if="!isMarket" :accuracy="accuracy.fixedNumber" class="mt30" @keyDown="showPercent=false"></cp-adjust>
        <p class="price-placeholder mt30" v-if="isMarket">{{$t('exchange.exchange_market_price')}}</p>
        <p class="mt10">
            {{$t('home.home47')}}:
            <valuation
                    :lastPrice="formData.price"
                    :symbol="currentSymbol"
                    :curCNYPrice="curCNYPrice"
                    :unitPrice="unitPrice"/>
        </p>
        <div class=" mt20">
            <!-- <numberbox v-model="formData.amount" :accuracy="accuracy.quantityAccu" :placeholder="$t('exchange.exchange_amount')" v-focus></numberbox>
            <span>{{isBuy ? baseSymbol : currentSymbol}}</span> -->
            <cp-adjust v-model="formData.amount" :accuracy="accuracy.quantityAccu" class=""
                       :tip="$t('home.home40')+'('+(isMarket ? (isBuy ?baseSymbol:currentSymbol):currentSymbol)+')'" @keyDown="showPercent=false"></cp-adjust>
        </div>

        <div class="range-percent mt30">
            <div class="dots"
                 :class="{d2:percent>=25,d3:percent>=50,d4:percent>=75,d5:percent>=100, d6:percent>=100, active:showPercent}">
                <span v-tap="{methods:()=>{percent=25, showPercent = true}}">20%</span>
                <span v-tap="{methods:()=>{percent=50, showPercent = true}}">40%</span>
                <span v-tap="{methods:()=>{percent=75, showPercent = true}}">60%</span>
                <!--<span v-tap="{methods:()=>{percent=80, showPercent = true}}">80</span>-->
                <span v-tap="{methods:()=>{percent=100, showPercent = true}}">100%</span>
            </div>
        </div>
        <div class="total-input" v-if="!isMarket">

            <numberbox v-model="formData.total" :accuracy="accuracy.amountAccu" :placeholder="`${$t('exchange.exchange_total')}(${baseSymbol})`"></numberbox>
        </div>
        <div class="ac-area mt50">
            <button type="button" :class="[isBuy ? 'buyBtn' : 'sellBtn', lockExtrust ? 'disabled' : '']"
                    @click="buyOrSell">
                {{$t(isBuy?'exchange.exchange_buy':'exchange.exchange_sell')}}
            </button>
        </div>
        <p class="blance-tip mt30">
            <span>{{$t('exchange.value_available')}}<!--可用--></span>
            <span class="ft-c-white f24">
                <small class="el">{{Number(toFixed(isBuy ?
                    toBalance.availableBalance : fromBalance.availableBalance)) | number}} </small>
                {{isBuy ?baseSymbol:currentSymbol}}
            </span>
        </p>
        <p class="blance-tip mt15">
            <span>{{$t('exchange.value_frozen')}}<!--冻结--> </span>
            <span class="ft-c-white f24">
                <small class="el">{{Number(toFixed(isBuy ?
                    toBalance.frozenBalance : fromBalance.frozenBalance)) | number}} </small>
                {{isBuy ?baseSymbol:currentSymbol}}
            </span>
        </p>
        <p class="blance-tip mt60">
            <span>{{$t('home.home46')}}<!--总资产--> </span>
            <span class="ft-c-white f24">
                <small class="el">{{(Number(toFixed(isBuy ?
                toBalance.availableBalance : fromBalance.availableBalance))+Number(toFixed(isBuy ?
                    toBalance.frozenBalance : fromBalance.frozenBalance))) | number}} </small>
                {{isBuy ?baseSymbol:currentSymbol}}
            </span>
        </p>
        <!--<div class="mt40 tip-panel">-->
            <!--<p>{{$t('account.to_unlock')}}&lt;!&ndash; 今日映射ETV &ndash;&gt;</p>-->
            <!--<p>{{toFixed(toUnlockAmount,4)}} ETV</p>-->
        <!--</div>-->
        <!--<div class="mt20 tip-panel">-->
            <!--<p>{{$t('exchange.today_buy')}}&lt;!&ndash; 今日买 &ndash;&gt;</p>-->
            <!--<p>{{toFixed(statisticsTodayTrade.buyTotalAmount,4)}} / {{toFixed(toUnlockAmount*100,4)}} ETV</p>-->
        <!--</div>-->
        <!--<div class="mt20 tip-panel">-->
            <!--<p>{{$t('exchange.today_sell')}}&lt;!&ndash; 今日卖 &ndash;&gt;</p>-->
            <!--<p>{{toFixed(statisticsTodayTrade.sellTotalAmount,4)}} / {{toFixed(toUnlockAmount*100,4)}} ETV</p>-->
        <!--</div>-->
        <!--<div class="mt20 tip-panel tiptxt">-->
            <!--<p>{{$t('exchange.maptip')}}&lt;!&ndash; 提示：24小时映射一次，买卖ETV数量达到要求后等待发放ETV即可 &ndash;&gt;</p>-->
        <!--</div>-->
        <!-- <div class="tip_color">
            <span>
                <i class="green"></i>
                {{$t('home.home41')}}
            </span>
            <span>
                <i class="red"></i>
                {{$t('home.home42')}}
            </span>
        </div>
        <div class="space-area" id="depth"></div> -->
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox} from 'mint-ui'
    import regUtils from '@/assets/js/regex'
    import utils from '@/assets/js/utils'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import cpAdjust from '@/components/adjust'
    import numberbox from '@/components/numberInput'
    import valuation from '@/components/valuation'

    export default {
        props: {
            accuracy: {
                type: Object,
                default: 2
            },
            currentSymbol: {
                type: String,
                default: ''
            },
            baseSymbol: {
                type: String,
                default: ''
            },
            tradeType: {
                type: String,
                default: 'buy'
            },
            pTradeType: null,
            curCNYPrice: 0
        },
        components: {
            cpAdjust,
            valuation,
            numberbox
        },
        data() {
            return {
                showPercent:true,
                entrustType: 'limit',
                lockExtrust: false,
                changeInput: '',
                errorObj: {},
                percent: 0,
                updateValue: true,
                isTrustChioce: false,
                formData: {
                    price: 0,
                    amount: '',
                    total: ''
                },
                toUnlockAmount:0,
                statisticsTodayTrade:{},
                mainMarket:'LTNUSDT',
                moPrice: 0
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getMarketConfig', 'getLast24h', 'getEntrustNewPrice', 'getUserWallets','getUserInfo','getSysParams']),
            unlockNeed(){
                let _rst = numUtils.minus(numUtils.mul(this.toUnlockAmount, 100), this.statisticsTodayTrade)
                return _rst>=0?_rst:0
            },
            symbol() {
                return `${this.currentSymbol}${this.baseSymbol}`
            },
            isBuy() {
                return this.tradeType === 'buy'
            },
            isMarket() {
                return this.entrustType === 'market'
            },
            fromBalance() {
                for (let i = 0; i < this.getUserWallets.length; i++) {
                    let item = this.getUserWallets[i]
                    if (item.symbol === this.currentSymbol) {
                        return item
                    }
                }
                return {}
            },
            toBalance() {
                // console.log(this.getUserWallets)
                for (let i = 0; i < this.getUserWallets.length; i++) {
                    let item = this.getUserWallets[i]
                    if (item.symbol === this.baseSymbol) {
                        console.log(item)
                        return item
                    }
                }
                return {}
            },
            marketPrice() {
                return this.$t('exchange.exchange_market_price') // 市价
            },
            unitPrice(){
                return Number(this.curCNYPrice)/Number(this.moPrice)// 单价
            }
        },
        watch: {
            entrustType() {
                this.percent = 0
                this.formData.amount = ''
            },
            tradeType() {
                this.formData.amount = ''
                this.percent = 0
            },
            'formData.price'(newVal, oldVal) {
                this.changeValue(newVal, oldVal, 'price')
            },
            'formData.amount'(newVal, oldVal) {
                this.changeValue(newVal, oldVal, 'amount')
            },
            'formData.total'(newVal, oldVal) {
                this.changeValue(newVal, oldVal, 'total')
            },
            getLast24h(newVal) {
                if (this.updateValue) {
                    this.updateValue = false
                    setTimeout(() => {
                        this.formData.price = this.toFixed(utils.removeEndZero(this.getLast24h.close))
                        // console.log(this.formData.price)
                        this.moPrice = this.toFixed(utils.removeEndZero(this.getLast24h.close))
                    }, 200)
                }
            },
            symbol(_new) {
                this.updateValue = true;
                if(_new===this.mainMarket){
                    this.entrustType = 'limit'
                }
            },
            percent(newVal) {
                this.switchPercent(newVal)
                // this.formData.total =
            },
            getEntrustNewPrice() {
                this.formData.price = this.toFixed(this.getEntrustNewPrice)
            },
        },
        created() {
            this.tradeType = this.pTradeType ? this.pTradeType : 'buy'
            this.getToUnlock()
            this.getStatisticsTodayTrade()
            this.$nextTick(() => {
                this.addEvents({
                    name: 'businessEvent',
                    fun: this.businessEvent
                })
                this.addEvents({
                    name: 'updateStatisticsEvent',
                    fun: ()=>{
                        this.getToUnlock()
                        this.getStatisticsTodayTrade()
                    }
                })
            })
        },
        beforeDestroy() {
            this.removeEvents('businessEvent')
            this.removeEvents('updateStatisticsEvent')
        },
        methods: {
            ...mapActions(['addEvents', 'removeEvents']),
            getToUnlock(){
                this.getApiToken && marketApi.getToUnlock(res=>{
                    this.toUnlockAmount = res || 0
                }, msg=>{
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            },
            getStatisticsTodayTrade(){
                this.getApiToken && marketApi.getStatisticsTodayTrade(res=>{
                    this.statisticsTodayTrade = res || 0
                }, msg=>{
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            },
            switchTradeType(type) {
                this.tradeType = type
                this.percent = 0
            },
            toggleChoice(e) {
                if (typeof e === 'string') {
                    this.entrustType = e
                }
                this.isTrustChioce = !this.isTrustChioce
            },
            businessEvent(res) {
                if (res && res.type === 'price') {
                    this.formData.price = res.value
                } else if (res && res.type === 'amount') {
                    this.formData.amount = res.value
                } else if (res && res.type === 'total') {
                    this.formData.total = res.value
                }
            },
            changeValue(newVal, oldVal, type) {
                if (numUtils.BN(newVal).equals(numUtils.BN(oldVal))) {
                    this.changeInput = ''
                    return
                }
                if (numUtils.BN(newVal).equals(numUtils.BN(0))) {
                    if (this.changeInput) {
                        return
                    }
                    this.changeInput = type
                    if (type === 'amount' || type === 'price') {
                        this.formData.total = ''
                    }
                    if (type === 'total' || type === 'price') {
                        this.formData.amount = ''
                    }
                    this.$nextTick(() => {
                        this.changeInput = ''
                    })
                    return
                }
                if (this.changeInput && this.changeInput !== type) {
                    this.changeInput = ''
                    return
                }
                this.changeInput = type
                if (type === 'total' && numUtils.BN(this.formData.price).gt(0)) {
                    this.formData.amount = this.toFixed(numUtils.div(this.formData.total, this.formData.price))
                } else if (type === 'total' && numUtils.BN(this.formData.amount).gt(0)) {
                    this.formData.price = this.toFixed(numUtils.div(this.formData.total, this.formData.amount))
                } else if (numUtils.BN(this.formData.price).gt(0) && numUtils.BN(this.formData.amount).gt(0)) {
                    this.formData.total = this.toFixed(numUtils.mul(this.formData.price, this.formData.amount))
                } else if (numUtils.BN(this.formData.price).gt(0) && numUtils.BN(this.formData.total).gt(0)) {
                    this.formData.amount = this.toFixed(numUtils.div(this.formData.total, this.formData.price))
                } else {
                    this.changeInput = ''
                }
            },
            switchPercent(p) {
                p = p / 100
                let amount = numUtils.mul(this.tradeType === 'buy' ? this.toBalance.availableBalance : this.fromBalance.availableBalance, p).toFixed(this.fixedNumber)
                if (this.entrustType === 'market' && this.tradeType === 'buy') {
                    this.formData.amount = Number(amount) ? numUtils.div(amount, this.getLast24h.close).toFixed(this.fixedNumber, 1) : ''
                    return
                }
                if (this.tradeType === 'buy') {
                    this.formData.total = Number(amount)?amount:''
                } else {
                    this.formData.amount = Number(amount)?amount:''
                }
                // console.log(this.formData.total,this.formData.amount)
            },
            buyOrSell() {
                this.errorObj = {}
                if (!this.getApiToken) {
                    Tip({type: 'danger', message: this.$t(`exchange.exchange_Not_logged`)}) // 未登录
                    return
                }
                let price = 0
                let msg = null
                let amount = this.formData.amount
                let balance = null
                let fromAccountId = null
                let toAccountId = null
                let direction = null// 1买 2卖
                if (this.entrustType === 'limit') { // 限价
                    price = this.formData.price
                    if (!price) {
                        msg = this.$t('exchange.exchange_price_empty') // 价格不能为空
                    } else if (numUtils.BN(price).equals(numUtils.BN(0))) {
                        msg = this.$t('exchange.exchange_price_ont') // 价格不能为0
                    } else if (!regUtils.intOrDecimal.test(price)) {
                        msg = this.$t('exchange.exchange_price_decimal_int') // 价格只能为整数或小数
                    }
                    if (msg) {
                        this.errorObj = {
                            type: 'price',
                            msg: msg
                        }
                        Tip({type: 'danger', message: msg})
                        return
                    }
                } else { // 市价
                    price = -1
                }
                if (!amount) {
                    msg = this.$t('exchange.exchange_number_empty') // 数量不能为空
                } else if (numUtils.BN(amount).equals(numUtils.BN(0))) {
                    msg = this.$t('exchange.exchange_number_ont') // 数量不能为0
                } else if (!regUtils.intOrDecimal.test(amount)) {
                    msg = this.$t('exchange.exchange_number_decimal_int') // 数量只能为整数或小数
                }
                if (msg) {
                    this.errorObj = {
                        type: 'amount',
                        msg: msg
                    }
                    Tip({type: 'danger', message: msg})
                    return
                }
                if (!this.getMarketConfig) {
                    Tip({type: 'danger', message: `error_code.SYMBOL_INEXIST`})
                    return
                }
                let minQuantity = numUtils.BN(this.getMarketConfig[this.symbol].minQuantity).toString()
                let minAmount = numUtils.BN(this.getMarketConfig[this.symbol].minAmount).toString()

                // 限价 最小金额控制
                if (this.entrustType === 'limit' && numUtils.BN(this.formData.total).lt(minAmount)) {
                    // 最小金额必须大于等于{0}{1}
                    Tip({
                        type: 'danger',
                        message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)
                    })
                    return
                }

                // 限价\市价 最小数量控制
                // this.entrustType === 'market' &&
                if (numUtils.BN(this.formData.amount).lt(minQuantity)) {
                    // 最小数量必须大于等于{0}{1}
                    Tip({
                        type: 'danger',
                        message: this.$t('public.min_amount_greater_than').format(minQuantity, this.currentSymbol)
                    })
                    return
                }
                if (this.tradeType === 'buy') { // 买
                    direction = 1 // 买
                    balance = this.toBalance.availableBalance // 金额
                    fromAccountId = this.toBalance.accountId // baseSymbol帐号id
                    toAccountId = this.fromBalance.accountId // currentSymbol帐号id
                    if (numUtils.BN(amount).mul(numUtils.BN((price === -1 ? this.getLast24h.close : price))).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
                        Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
                        return
                    }
                    /*let _price_higher = this.toFixed(numUtils.mul(this.getSysParams.basicPrice.value, numUtils.add( 1, this.getSysParams.upDownRatio.value)))
                    if (this.symbol === this.mainMarket && this.entrustType === 'limit' && numUtils.BN(price).gt(_price_higher)) {
                        Tip({type: 'danger', message: this.$t('exchange.entrustment_price_higher').format(_price_higher)}) // 您的委托价格超出最高价格 {0}
                        return
                    }*/
                } else if (this.tradeType === 'sell') {
                    direction = 2 // 卖
                    balance = this.fromBalance.availableBalance // 金额
                    fromAccountId = this.fromBalance.accountId // 帐号id
                    toAccountId = this.toBalance.accountId // 帐号id
                    if (numUtils.BN(amount).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
                        Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
                        return
                    }
                    let _price_lower = this.toFixed(numUtils.mul(this.getLast24h.close, numUtils.minus( 1, this.getSysParams.upDownRatio.value)))
                    if (this.symbol === this.mainMarket && this.entrustType === 'limit' && numUtils.BN(price).lt(_price_lower)) {
                        Tip({type: 'danger', message: this.$t('exchange.entrustment_price_lower').format(_price_lower)}) // 您的委托价格低于最低价格 {0}
                        return
                    }
                }
                let data = {
                    price: price, // 表示价格‘-1’表示市价
                    amount: amount, //
                    fromAccountId: fromAccountId,
                    toAccountId: toAccountId,
                    market: this.symbol,
                    // marketId: 2, // 市场id
                    direction: direction // 1买 2卖
                }

                if (this.entrustType === 'limit' && this.tradeType === 'sell' && numUtils.BN(this.formData.price).lt(numUtils.mul(this.getLast24h.close, 0.95))) {
                    // 您委托价格低于最新成交价5%，是否确认下单？
                    MessageBox.confirm(this.$t('public.entrustment_price_lower_5')).then(() => {
                        this.okCallback(data)
                    }, () => {
                    })
                    return
                } else if (this.entrustType === 'limit' && this.tradeType === 'buy' && numUtils.BN(this.formData.price).gt(numUtils.mul(this.getLast24h.close, 1.05))) {
                    // 您委托价格高于最新成交价5%，是否确认下单？
                    MessageBox.confirm(this.$t('public.entrustment_price_higher_5')).then(() => {
                        this.okCallback(data)
                    }, () => {
                    })
                    return
                }
                this.okCallback(data)
            },
            okCallback(data) {
                if (this.lockExtrust) {
                    return
                }
                this.lockExtrust = true
                marketApi.marketBuyorSell(data, (res) => {
                    this.formData.amount = ''
                    this.formData.total = ''
                    this.lockExtrust = false
                    Tip({type: 'success', message: this.$t('exchange.exchange_Commissioned_success')}) // 委托成功
                    let callBack = ()=>{
                        this.$parent.$refs.entrust.getCurrentEntrust()
                        this.$parent.$refs.historydeal.getList()
                        this.getToUnlock()
                        this.getStatisticsTodayTrade()
                    }
                    setTimeout(callBack,1000)
                    setTimeout(callBack,2000)
                    setTimeout(callBack,3000)
                }, (msg) => {
                    this.lockExtrust = false
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            changePriceValue(price) {
                if (this.entrustType === 'limit') {
                    this.formData.price = this.toFixed(price)
                }
            },
            toFixed(value, fixed) {
                console.log(value, fixed, this.accuracy.fixedNumber)
                let _num = numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed)
                return utils.removeEndZero(_num)
            }
        }
    }
</script>

<style lang="less" scoped>
    @c_white: #ffffff;
    @c_buy: #0EB574;
    @c_sell: #D74E5A;
    @c_light: #666;
    @c_board: #4B5875;
    .c_light {
        color: @c_light;
        height: 0.32rem;
    }

    .left {
        width: 3.2rem;
        position: relative;
        /*display: flex;*/
        /*flex-direction: column;*/
    }

    .left .acBtns {
        height: 0.75rem;
        display: flex;
    }

    .left .acBtns button {
        flex: 1;
        height: 100%;
        font-size: 0.34rem;
        border: none;
        color: #91A4A3;
        background-color: @c_white;
        border-radius: 3px;
    }

    .left .acBtns button.sell {
        margin-left: 0.2rem;
    }

    .left .acBtns button.buy.active {
        color: #fff;
        background: @c_buy;
    }

    .left .acBtns button.sell.active {
        color: #fff;
        background: @c_sell;
    }

    .left .trust-type-choice {
        font-size: 0.24rem;
        position: relative;
        margin-top: 0.2rem;
    }
    .left .trust-type-choice > span{
        color: @c_white;
    }
    .left .trust-type-choice > span:after {
        display: inline-block;
        content: '';
        margin-left: 0.1rem;
        border-top: 0.08rem solid #666;
        border-left: 0.06rem solid transparent;
        border-right: 0.06rem solid transparent;
        margin-bottom: 0.04rem;
    }

    .left .trust-type-choice .choices {
        position: absolute;
        top: 0.5rem;
        left: 0;
        width: 2.2rem;
        z-index: 100;
        box-shadow: 0 0.1rem 0.2rem #1A2233;
        border-radius: 0.08rem;
        overflow: hidden;
    }

    .left .trust-type-choice .choices li {
        line-height: 0.8rem;
        text-align: center;
        background-color: #1A2233;
    }

    .left .trust-type-choice .choices li:first-of-type {
    }

    .left .trust-type-choice .choices li.active {
        background-color: #2e3749;
        color: #ffffff;
    }

    .left .price-placeholder {
        height: 0.8rem;
        border: 0.02rem solid #4B5875;
        line-height: 0.8rem;
        text-align: center;
        color: #ffffff;
        font-size: 0.24rem;
        border-radius: 0.1rem;
    }

    .left .amount {
        height: 0.64rem;
        display: flex;

        input {
            border: none;
            background-color: transparent;
            padding-left: 0.2rem;
            padding-right: 0.2rem;
            width: 2.6rem;
            font-size: 0.3rem;
        }

        span {
            padding-right: 0.2rem;
            flex: 1;
            line-height: 0.8rem;
            text-align: right;
            color: @c_light;
        }
    }

    .left .blance-tip {
        display: flex;
        justify-content: space-between;
        span:first-of-type{min-width: 0.7rem; font-size: 0.26rem;}
        span:last-of-type{word-break: break-all; font-size: 0.24rem;    display: flex;line-height: 0.36rem;}
    }

    .left .range-percent {
        position: relative;
        height: 0.4rem;
    }

    .left .range-percent p {
        text-align: center;
        color: @c_light;
        margin-bottom: 0.15rem;
    }

    .left .range-percent .dots {
        position: absolute;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        /*&:after{*/
            /*width: 100%;*/
            /*height: 0.04rem;*/
            /*position: absolute;*/
            /*background: #4B5875;*/
            /*top: 0.18rem;*/
            /*left: 0;*/
            /*content: '';*/
        /*}*/
    }

    .left .range-percent .dots span {
        /*z-index: 1;*/
        /*width: 0.4rem;*/
        height: 0.4rem;
        position: relative;
        z-index: 9;
        font-size: 0.2rem;
        line-height: 0.4rem;
        text-align: center;
        border:0.02rem solid #4B5875;
        padding: 0 0.1rem;
        border-radius: 0.06rem;
        /*&:after{*/
            /*content: '';*/
            /*width: 0.14rem;*/
            /*height: 0.3rem;*/
            /*background: #4B5875;*/
            /*display: block;*/
            /*top:0.05rem;*/
            /*left: 0.14rem;*/
            /*position: absolute;*/
            /*border-radius: 0.04rem;*/
        /*}*/
    }

    .left .range-percent /deep/ .mt-range-runway {
        border-top-color: @c_board;
    }

    .left .range-percent /deep/ .mt-range-thumb {
        border: 3px solid #fff;
        background-color: @c_buy;
        z-index: 2;
        top: 50%;
        transform: translateY(-50%);
        box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
    }

    .left .range-percent /deep/ .mt-range-progress {
        background-color: @c_buy;
    }

    .left .range-percent .dots.active.d2 span:nth-of-type(1),
    .left .range-percent .dots.active.d3 span:nth-of-type(2),
    .left .range-percent .dots.active.d4 span:nth-of-type(3),
    .left .range-percent .dots.active.d5 span:nth-of-type(4),
    .left .range-percent .dots.active.d6 span:nth-of-type(5) {
        background:@c_board;
        height: 0.4rem;
        color: #eee;
        z-index: 9;
    }


    .left .space-area {
        display: flex;
        flex: 1;
        width: 100%;
        height: 3.9rem;
        position: relative;
        overflow: hidden;
    }

    .left .ac-area {
        margin-bottom: 0.3rem;
    }

    .left .buyBtn, .left .sellBtn {
        width: 100%;
        height: 0.9rem;
        color: #fff;
        border: none;
        font-size: 0.34rem;
        border-radius: 0.08rem
    }

    .left .buyBtn {
        background: @c_buy;
    }

    .left .sellBtn {
        background: @c_sell;
    }

    .left .ac-area button.disabled {
        background-color: #999 !important;
    }

    .left .total-input {
        position: relative;
        text-align: center;
        margin-top: 0.5rem;
        input{
            outline: none;
            height: 0.9rem;
            line-height: 0.9rem;
            padding: 0;
            text-align: center;
            position: relative;
            font-size: 0.3rem;
            width: 100%;
            border: 0.02rem solid #4B5875;
            background: none;
            border-radius:0.08rem;
            color: #ffffff;
        }
    }
    .tip_color{
        margin-top: 1.1rem;
        span{
            display: inline-flex;
            align-items: center;
            padding-right: .3rem;
            i{
                display: inline-block;
                width: 0.26rem;
                height: 0.26rem;
                margin-right: 0.1rem;
                &.green{
                    background:#439B64;
                }
                &.red{
                    background:#E14B26;
                }
            }
        }
    }
    .tip-panel {
        line-height: 1.7;
        font-size: 0.24rem;
        &.tiptxt {
            word-break: break-all;
            line-height: 1.5;
            font-size: 0.2rem;
        }
    }
    .el{
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        flex: 1;
        max-width: 2rem;
        padding-right: 0.06rem;
    }
</style>
