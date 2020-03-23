<template>
  <div class="nikename-form">
    <input name="nickname" type="text" maxlength="15" v-model="nicknameValue" v-validate="'required'" :placeholder="$t('public0.public73')" />
    <ul  class="mt20 f24 ft-c-note lh17">
      <li>· {{$t('account.nickname_rule_1')}}</li>
      <li>· {{$t('account.nickname_rule_2')}}</li>
      <li>· {{$t('account.nickname_rule_3')}}</li>
    </ul>
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
.nikename-form input {
  margin-top: 0.15rem;
  width: 100%;
  background-color: #fff;
  border: 1px solid #E6E6E6;
  color: #333;
  font-size: 0.32rem;
  padding: 0.2rem;
  border-radius: 4px;
}
</style>
