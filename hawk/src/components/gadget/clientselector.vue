<template>
    <f7-page :id="pageId">
        <f7-navbar :title="title">
            <f7-nav-right>
                <f7-link href="#" @click="cancel">取消</f7-link>
                <f7-link href="#" @click="submit">确定</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-searchbar
            disable-button
            placeholder="输入客户名称、区域或者类型"
            search-container=".clientList"
            search-in=".item-title, .item-text, .client-attrs"
        ></f7-searchbar>
        <f7-block-title>客户列表</f7-block-title>
        <f7-list class="clientList" media-list>
            <f7-list-item
                v-if="multiple"
                checkbox
                title = "全选" 
                @change="selectAll"
            ></f7-list-item>
            <f7-list-item 
                v-for = "(c, index) in clients"
                :key = "index"
                :checkbox = "multiple"
                :radio = '!multiple'
                :checked = "updatedList.includes(c._id)"
                :title = "c.name" 
                name = "clientCheckbox"
                :value = "c._id"
                :text = "c.region"
                @change="update"
            >
                <div class="client-attrs" style="display:none">
                    {{ `${c.type} ${c.grade} ${c.intention} ${c.location && c.location.address}` }}
                </div>
            </f7-list-item>
        </f7-list>        
    </f7-page>
</template>

<script>
import {mapGetters} from 'vuex';
import axios from 'axios';

export default {
    name: 'clientselector',
     
    props: {
        selectedList: {
            type: Array,
            default: () => { return [] }
        },
        title: {
            type: String,
            default: '选择客户'
        },
        multiple: {
            type: Boolean,
            default: true
        }
    },

    data: () => {
        return {
            pageId: 'clientselector' + Math.floor(Math.random() * 100),
            updatedList: [],
            clients: [],
        }
    },

    mounted: function() {
        if (!this.clients || this.clients.length == 0) this.load();
        this.updatedList = this.selectedList.slice(0);
        this.$forceUpdate();
    },

    methods: {
        selectAll(event) {
            let inputs = $('#' + this.pageId + ' li:not(.hidden-by-searchbar) input[name=clientCheckbox]');

            if (inputs.length > 1 && !this.multiple) {
                $alert('只能选择一位客户', '操作错误');
                return;
            }

            let cIds = [];
            inputs.each(function() { cIds.push(this.value)});

            if (event.target.checked) {
                cIds.forEach(id => {
                    if (!this.updatedList.includes(id)) {
                        this.updatedList.push(id);
                    }
                });
            } else {
                this.updatedList = this.updatedList.filter(id => !cIds.includes(id));
            }
        },

        update(event) {
            let checked = event.target.checked;
            let uId = event.target.value;

            if (!this.multiple) {
                this.updatedList = [uId];
                return;
            }

            if (checked && !this.updatedList.includes(uId)) {

                if (!this.multiple && this.updatedList.length > 0) {
                    $alert('只能选择一位客户', '操作错误');
                    event.target.checked = false;
                    return;
                }
                this.updatedList.push(uId);
            } else if (!checked && this.updatedList.includes(uId)) {
                this.updatedList.splice(this.updatedList.indexOf(uId), 1);
            }
            
        },

        submit() {
            if (!this.multiple && this.updatedList.length > 1) {
                $alert('只能选择一位客户', '操作错误');
            }
            let result = this.updatedList.map(i => this.clients.find(c => c._id == i));
            this.$emit('submit', this.multiple ? result : result[0]);
        },

        cancel() {
            this.$emit('cancel');
        },

        load() {
            this.clients = []; // clean it up

            $preloader.show();
            axios.get('api/client/').then(resp => {
                $preloader.hide();
                this.clients = resp.data;
            }).catch(err => {
                $preloader.hide();
                console.error(err);
                $alert('无法更新客户数据，请稍后再试', '操作错误');
            })

        }
    }
}
</script>

