<template>
    <div class="page">
        <top-back>{{$t('user.lang')}}</top-back>
        <div class="page-main">
            <div class="cont box">
                <ul>
                    <li v-for="item in options"
                        v-tap="{methods: getAndSetLang, lang:item.value}"
                        :class="{active: lang === item.value}">{{item.label}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import langApi from '@/api/language'
export default {
    name: "set-lang",
    data(){
        return{
            lang: '',
            options: [
                {
                    label: '中文',
                    value: 'zh-CN'
                },
                {
                    label: 'English',
                    value: 'en'
                },
                /*{
                    label: '한국어',
                    value: 'kr'
                }*/
            ]
        }
    },
    computed: {
        ...mapGetters(['getLang']),
    },
    created(){
        this.lang = this.getLang
    },
    methods:{
        ...mapActions(['setLang']),
        getAndSetLang(args){
            langApi.getLanguage(args.lang,res=>{
                this.lang = args.lang
                this.$i18n.locale = args.lang
                this.$i18n.setLocaleMessage(args.lang, res)
                window.localStorage[args.lang] = JSON.stringify(res)
                this.setLang(this.lang)
            })
        }
    }
}
</script>

<style scoped lang="less">
.cont{
    margin: 0.2rem -0.3rem;
    ul{
        display: flex;
        flex-flow: column;
        /*background: #fff;*/
        padding: 0 0.3rem;
        li{
            padding: 0.3rem 0;
            border-bottom:  0.02rem solid #273246;
            &:last-child{
                border-bottom: none;
            }
            &.active{
                background: url("../../../assets/img/ic_dg@3x.png") no-repeat right center;
                background-size: 0.3rem;
            }
        }
    }
}
</style>
