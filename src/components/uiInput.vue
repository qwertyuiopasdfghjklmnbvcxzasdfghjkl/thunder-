<template>
    <div class="ui_input">
        <label>
            <span v-html="placeholder ? '':_t" :class="{'hover':active}" :style="style"></span>
            <input
                    ref="input"
                    :type="type"
                    @focus="focus()"
                    @blur="blur()"
                    @input="ent()"
                    :value="text"
                    :maxlength="maxlength"
                    :readonly="readonly"
                    :placeholder="placeholder? _t: ''">
        </label>
    </div>
</template>

<script>
    export default {
        name: "uiInput",
        props: {
            label: {
                type: String,
                default: null,
            },
            type: {
                type: String,
                default: 'text',
            },
            placeholder: {
                type: Boolean,
                default: false
            },
            maxlength: {
                type: Number,
                default: 120
            },
            title: {
                type: String,
                default: null
            },
            value: null,
            readonly:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                text: this.value,
                active: false,
                _t:null,
                style: {},
            }
        },
        watch: {
            value(){
                this.focus()
                this.text = this.value
            }
        },
        created(){
            this._t = this.label
        },
        methods: {
            focus() {
                this.active = true;
                if (this.title) {
                    this._t = this.title
                }
                this.style={
                    opacity: 1
                }
            },
            blur() {
                this.active = this.text
                if (!this.active) {
                    this._t = this.label
                    this.style={
                        opacity: 1
                    }

                }else{
                    this.style={
                        opacity: 0
                    }
                }
                this.$emit('blur', this.text);
            },
            ent() {
                this.text = this.$refs.input.value
                this.$emit('input', this.text);
            }
        }
    }
</script>

<style scoped lang="less">
    .ui_input {
        label {
            display: block;
            color: #333;
            position: relative;
            height: 0.8rem;
            background: #151C2C;
            transition: border 0.3s;
            border-radius: 0.1rem;
            overflow: hidden;

            &:hover {
                border-bottom-color: #5CACCF;
            }

            input {
                display: block;
                width: 100%;
                border: none;
                outline: none;
                height: 0.8rem;
                position: absolute;
                left: 0;
                bottom: 0;
                background: none;
                font-size: 0.32rem;
                color: #ffffff;
                padding: 0 0.2rem;
            }

            span {
                position: absolute;
                left: 0;
                color: #999;
                top: 0.28rem;
                font-size: 0.28rem;
                transition: 0.3s;
                /*opacity: 1 !important;*/
                &.hover {
                    color: #999;
                    top: 0;
                    font-size: 0.24rem;
                }
            }
        }
    }
    input:hover, input:active, input:focus, input:visited, input:focus-within, input:-internal-autofill-selected{
        background-color: transparent !important;
    }
</style>
