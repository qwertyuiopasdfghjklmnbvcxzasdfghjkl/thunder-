<template>
    <div class="page">
        <top-back style="background: transparent"><!-- {{$t('referral.invitation_poster')}} Invitation Code --> </top-back>
        <div class="poster">
            <div class="bottom">

                <div class="qrcode">
                    <div ref="qrcode"></div>
                    <i class="logo"></i>
                </div>
                <div>
                    <p class="f30"><strong>{{$t('market.invite_p')}}</strong></p>
                    <p class="f24 mb15">{{$t('market.invite_span')}}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import utils from '@/assets/js/utils'

    export default {
        mounted() {
            utils.qrcode(this.$refs.qrcode, {
                text: this.$route.query.url || '',
                width: 150,
                height: 150
            })
        }
    }
</script>

<style lang="less" scoped="">
    .poster {
        background: url('../../assets/img/invite_bg.jpg') no-repeat center top / cover;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .bottom {
        position: absolute;
        bottom: 0.6rem;
        left: 0;
        right: 0;
        height: 1.8rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        color: #ffffff;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        p {
            max-width: 5.1rem;
            line-height: 0.4rem;
        }

        .qrcode {
            background: #ffffff;
            border:0.05rem solid #ffffff;
            width: 1.3rem;
            height: 1.3rem;
            margin-right: 0.2rem;
            /deep/ canvas {
                max-width: 100%;
            }

            /* .logo {

                background: url('../../assets/img/logo.png') #fff no-repeat center/contain;
                border: 0.06rem solid #fff;
                border-radius: 4px;
                margin-top: -0.15rem;
                margin-left: -0.15rem;
                z-index: 1;
            }*/
        }
    }
</style>
