<template>
    <div class="page">
        <top-back>{{$t('vote.voteRules')}}<!-- 投票规则 --></top-back>
        <div class="page-main pt30">
            <div class="block">
                <h1 class="f32"><strong>{{$t('vote.voteRules')}}<!-- 投票规则 -->：</strong></h1>
                <ol class="mt30 lh20" v-if="$route.params.type==1">
                    <li>• {{$t('vote.rule_1_1')}}</li>
                    <li>• {{$t('vote.rule_1_2')}}</li>
                    <li>• {{$t('vote.rule_1_3')}}</li>
                    <li>• {{$t('vote.rule_1_4')}}</li>
                </ol>
                <ol class="mt30 lh20" v-else>
                    <li>• {{$t('vote.rule_2_1')}}</li>
                    <li>• {{$t('vote.rule_2_2')}}</li>
                    <li>• {{$t('vote.rule_1_3')}}</li>
                    <li>• {{$t('vote.rule_1_4')}}</li>
                </ol>
            </div>
        </div>
    </div>
</template>