<template>
    <f7-page>
        <f7-navbar title="选择客户联系人" back-link>
            <f7-nav-right>

            </f7-nav-right>
        </f7-navbar>

        <div>
            <div class="list-item" v-for="item in cousomer.contacts" @click="lastback(item)">
                <label>{{item.name}}</label>
                <span>{{item.phone}}</span>
            </div>
        </div>

    </f7-page>
</template>

<script>
    export default {
        name: "customersproson",

        props: [
            'lastPage',
            'cousomer',
            'contact'
        ],

        methods:{

            lastback(item){

                this.contact(item);
                this.$f7router.back();
            },
        },

    }
</script>

<style scoped>

    .list-item{

        background: #FFFFFF;
        width: 100%;
        height: 55px;
        font-size: 14px;

        border-bottom: 1px solid #f8f8f8;
    }
    .list-item label{
        padding-top: 8px;
        display: block;
        margin-left: 15px;
        color: #333333;
        font-weight: bold;
    }
    .list-item span{
        display: inline-block;
        padding-bottom: 10px;
        margin-left: 15px;
        color: #666666;
    }

</style>
