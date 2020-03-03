<template>
    <div class="bar" :class="item.disabled?'disabled':''" v-tap="{methods: reto}">
        <img v-if="item.icon" :src="item.icon"/>
        <slot name="name"><p v-html="item.name"></p></slot>
        <span v-if="item.small" v-html="item.small"></span>
        <slot></slot>
        <i v-if="!item.rightIcon">
            <img :src="right"/>
        </i>
    </div>
</template>

<script>
    export default {
        name: "RailBar",
        props: ['item'],
        data() {
            return {
                right: require('@/assets/img/i_rig_c@3x.png')
            }
        },
        created() {
        },
        methods:{
            reto(){
                if(this.item.disabled){
                    if(this.item.action){
                        this.item.action()
                    }
                    this.$emit('on-click')
                    return
                }
                this.$router.push({name: this.item.route})
                // console.log(this.item.route)
            }
        }
    }
</script>

<style scoped lang="less">
    .bar {
        /*background: #fff;*/
        padding: 0.22rem 0.32rem;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-between;
        height: 0.92rem;
        line-height: 0.48rem;
        position: relative;
        border-bottom: 0.01rem solid #273246;
        &:last-child{
            border-bottom: none;
        }
        p {
            flex-shrink: 1;
            flex-grow: 1;
            font-size: 0.3rem;
            /*padding-left: 0.2rem;*/
        }

        &>img {
            width: 0.48rem;
            height: 0.48rem;
            margin-right: 0.2rem;
            object-fit: contain;
        }

        span {
            margin-right: 0.2rem;
        }

        i {
            height: 0.48rem;
            img {
                width: 0.14rem;
                height: 0.24rem
            }
        }
        /*&.disabled p { color: #999; }*/
    }
    .small {
        color: #fff;
        display: inline-block;
        border-radius: 50%;
        width: 0.2rem;
        height: 0.2rem;
        background: #4AC6C3;
    }
</style>
