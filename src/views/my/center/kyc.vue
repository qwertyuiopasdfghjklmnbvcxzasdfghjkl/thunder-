<template>
  <div class="page">
    <top-back>{{$t('account.user_Real_name_verification')}}</top-back>
    <div class="page-main">
        <div class="full mt20">
            <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
        </div>
    </div>
  </div>
</template>

<script>
import individual from '@/api/individual'
import railBar from '@/components/RailBar'
export default {
  name: 'kyc',
  components: {
      railBar,
  },
  data(){
    return {
        data1: [
            {   route:'realnameInfo',
                name: this.$t('public0.public75'),
            },
            {
                route:'otherRealnameInfo',
                name: this.$t('public0.public76'),
            }
        ],
    }
  },
  beforeRouteEnter (from, to, next) {
    individual.getUserState((data) => {
      data.verifyState === 0 ? next() : window.vm.$router.replace({name: 'ucenter'})
    }, (msg) => {
      console.error(msg)
      window.vm.$router.replace({name: 'ucenter'})
    })
  }
}
</script>

<style lang="less" scoped>
 .hr {
    position: relative;

    &:after {
        content: '';
        display: block;
        position: absolute;
        z-index: 9;
        bottom: 0;
        right: 0.3rem;
        left:0.3rem;
        background: #eee;
        height: 0.02rem;
    }

    &:last-child:after {
        display: none;
    }
}
</style>
