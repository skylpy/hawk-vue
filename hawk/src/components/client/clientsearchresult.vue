<template>
    <f7-page @page:beforein="load">
        <f7-navbar :title="pageTitle" back-link></f7-navbar>
        <!--<f7-block-title>选项</f7-block-title>-->

        <f7-list>
            <f7-list-item :key="index" v-for="(item,index) in records" :title="item.name" @click="openClient(item)" link="#">
                <span slot="after" style="font-size: 13px;line-height: 35px">{{regionName(item.region)}}</span>
            </f7-list-item>
        </f7-list>
        <div v-if="!records.length" style="text-align: center;color:#9d9d9d;">————— 没有搜索结果 —————</div>
    </f7-page>
</template>

<style scoped>

</style>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        name: "clientsearchresult",
        props: [
            'filter'
        ],
        data(){
            return {
                pageTitle: '搜索结果',
                records: []
            }
        },
        computed: {
            ...mapGetters([
                'regionName',
            ]),
        },
        methods:{
            load(){
                $preloader.show();
                axios.get('api/client?q=' + JSON.stringify(this.filter)).then(resp => {
                    $preloader.hide();
                    this.records = resp.data
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法更新数据，请稍后再试', '操作错误');
                })
            },
            openClient(c) {
                this.$f7router.navigate('/client/client/', {
                    props: {
                        lastPage: '客户管理',
                        reference: c
                    }
                });
            },
        }
    }
</script>

