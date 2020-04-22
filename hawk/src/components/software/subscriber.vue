<template>
    <f7-page>
        <f7-navbar title="消息订阅" back-link>
            <f7-nav-right>
                <f7-link @click="submit">提交</f7-link>
            </f7-nav-right>  
        </f7-navbar>

        <f7-block-title>选项</f7-block-title>
        <f7-list>
            <f7-list-item 
                v-for="(value, key) in sources" :key="key"
                :title="key"
            >
                <f7-toggle 
                    slot="after"
                    :checked = "sources[key]"
                    color="red"  
                    @toggle:change="sources[key] = !(sources[key])"
                ></f7-toggle>  
            </f7-list-item>
        </f7-list>

    </f7-page>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
    data() {
        return {
            sources: {}
        }
    },

    computed: {
        ...mapGetters(['subscriber'])
    },

    mounted: function() {
        this.sources = deepCopy(this.subscriber);
    },

    methods: {
        ...mapMutations({
            set: 'SOFTWARE_CONFIG_SET'
        }),

        submit() {
            this.set({ subscriber: this.sources});
            this.$f7router.back();
        }
    }
}
</script>
