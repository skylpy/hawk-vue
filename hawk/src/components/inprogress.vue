<template>
    <f7-page>
        <f7-navbar title="未完成" back-link>
            <f7-nav-right>
                <f7-link href="#">确定</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-block style="text-align:center">
            <span>栏目建设中</span>
            <f7-progressbar infinite></f7-progressbar>
        </f7-block>
    </f7-page>
</template>

<script>
import {defaultImgUrl} from 'lib/loading';
import {mapGetters, mapActions} from 'vuex';
import personnelselector from 'gadget/personnelselector.vue';

export default {
    props: [
        'lastPage'
    ],

    data() {
        return {

        }
    },
}
</script>

