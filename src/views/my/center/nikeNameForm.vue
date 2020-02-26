<template>
  <div class="nikename-form">
      <ui-input
              :label="$t('public0.public73')"
              v-model="nicknameValue"
              :title="$t('public0.public190')"
      ></ui-input>
    <p class="mt20 f24 ft-c-lightGray tc">（{{$t('account.user_center_set_username')}}）<!--昵称只能设置一次--></p>
    <input name="nickname" type="text" v-show="false" v-model="nicknameValue" v-validate="'required'"/>
  </div>
</template>

<script>
import userApi from '@/api/individual'
import UiInput from "@/components/uiInput";
export default {
  name: 'nickname',
  components: {UiInput},
  props: {
    nikename: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      nicknameValue: ''
    }
  },
  computed: {
    msgs () {
      return {
        nickname: {required: this.$t('public0.public73')}, // 请输入昵称
      }
    }
  },
  mounted(){
    this.nicknameValue = this.nikename
  },
  methods: {
    submit () {
      this.$validator.validateAll().then((res) => {
        if (!res) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type:'danger', message: msg})
          }
          return
        }
        userApi.editNickname({nickname: this.nicknameValue}, (msg) => {
          this.$emit('hide',true)
          Tip({type:'success', message:this.$t(`error_code.${msg}`)})
        }, (msg) => {
          Tip({type:'danger', message:this.$t(`error_code.${msg}`)})
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
