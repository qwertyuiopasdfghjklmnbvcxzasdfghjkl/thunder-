import Loading from './loading'
import ErrorMC from './error'

export default function(WrappedComponent, promiseFn) {
  return {
    props:{
      params:{
        type:Object,
        default(){
          return WrappedComponent && WrappedComponent.params || {}
        }
      },
      size:{
        type:String,
        default:'small'
      }
    },
    data() {
      return {
        loading: false,
        error: false,
        data: null,
        Errors:[],
      }
    },
    methods: {
      async request() {
        this.loading = true
        this.error = false
        const res = await promiseFn(this.params)
        .catch((res)=>{
          this.Errors = this.getErrors(res)
          this.error = true
        }).finally(() => {
          this.loading = false
        })
        this.data = res
        this.$emit('getData',this.data)
      },
      getErrors(res){
        let _errors = []
        if(res){
          _errors.push(['api',res.config.url.slice(res.config.url.indexOf('/',7)+1)])
          res.config.data && _errors.push(['params',res.config.data])
          res.status !==200 && _errors.push(['status',res.status])
          _errors.push(['msg',res.data.constructor===String?res.data:this.$t(`error_code.${res.data.msg}`)])
        } else {
          _errors.push(['msg',this.$t(`error_code.Server_Error`)])
        }
        return _errors
      }
    },
    async mounted() {
      this.request()
    },
    render(h) {
      const slots = Object.keys(this.$slots)
        .reduce((arr, key) => arr.concat(this.$slots[key]), [])
        .map(vnode => {
          vnode.context = this._self
          return vnode
        })
      const args = {
        props: {
          // 混入 props
          ...(WrappedComponent && WrappedComponent.props || this.$props),
          loading: this.loading,
          error: this.error,
          data: this.data,
        },
        // 传递事件
        on: this.$listeners,
        // 传递 $scopedSlots
        scopedSlots: this.$scopedSlots,
        //传递普通$attrs
        attrs: this.$attrs
      }
      const wrapped = WrappedComponent||"div"
      const wrapper = h('div', {style:'position:relative;'}, [
        this.loading ? h(Loading, {props:{color:'#fff', bgColor:'rgba(0,0,0,.3)', size:0.8, maskSize:this.size}}) : (this.error ? h(ErrorMC, {props:{error:this.Errors, size:this.size}, on:{'retry':this.request}}) : null),
        h(wrapped, args, slots),
      ])

      return wrapper
    },
  }
}