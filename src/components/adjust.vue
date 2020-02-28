<template>
    <div class="price-adjust">
        <div><i class="icon-minus" v-tap="{methods:down}"></i></div>
        <div>
            <numberbox v-model="inputValue" :accuracy="accuracy" :placeholder="tip" @keyDown="setChange"></numberbox>
        </div>
        <div><i class="icon-plus" v-tap="{methods:up}"></i></div>
    </div>
</template>

<script>
    import numberbox from '@/components/numberInput'
    import numUtils from '@/assets/js/numberUtils'

    export default {
        name: 'cp-adjust',
        props: ['value', 'accuracy','tip'],
        components: {
            numberbox
        },
        data() {
            return {
                inputValue: '',
                fixed: 8
            }
        },
        watch: {
            inputValue() {
                this.updateFixed()
                this.$emit('input', this.inputValue)
            },
            value() {
                this.inputValue = this.value
                this.updateFixed()
            }
        },
        created() {
            this.inputValue = this.value
            this.updateFixed()
        },
        methods: {
            setChange(){
                this.$emit('keyDown')
            },
            updateFixed() {
                let arr = (this.inputValue || '').split('.')
                this.fixed = arr[1] ? arr[1].length : 3
            },
            up() {
                let val = this.toFixed(numUtils.max([numUtils.add(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
                this.inputValue = val
                this.setChange()
            },
            down() {
                let val = this.toFixed(numUtils.max([numUtils.minus(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
                this.inputValue = val
                this.setChange()
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixed : fixed, 1)
            }
        }
    }
</script>

<style lang="less" scoped>
    @c_board: #B9D0CF;
    .price-adjust {
        display: flex;
        height: 0.8rem;
        border-radius: 0.08rem;
        border: 0.01rem solid #4B5875;

        > div {
            display: flex;
        }
       > div:nth-of-type(2) {
            flex: 1;
            min-width: 0;
        }

        > div:nth-of-type(1) {
            width: 0.78rem;
            height: 0.78rem;
            border-right: 0.01rem solid #4B5875;
        }

        > div:nth-of-type(3) {
            width: 0.78rem;
            height: 0.78rem;
            border-left: 0.01rem solid #4B5875;
            color: #0EB574;
        }

        i {
            font-size: 0.36rem;
            line-height: 0.78rem;
            text-align: center;
            flex: 1;
            position: relative;
        }

        input {
            width: 100%;
            text-align: center;
            font-size: 0.24rem;
            background-color: transparent;
            border: none;
            position: relative;
            z-index: 6;
            color: #ffffff;
        }
    }
</style>
