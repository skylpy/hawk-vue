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
            placeholder="输入名字、部门或职位"
            search-container=".plist"
            search-in=".item-title, .item-text"
            disable-button-text="取消"
        ></f7-searchbar>
        <f7-block-title>员工列表</f7-block-title>
        <f7-list class="searchbar-not-found">
            <f7-list-item title="没有找到相应的联系人～"></f7-list-item>
        </f7-list>
        <f7-list class="plist" media-list>
            <f7-list-item
                v-if="multiple"
                checkbox
                title = "全选"
                @change="selectAll"
            ></f7-list-item>
            <f7-list-item
                v-for = "(p, index) in userList"
                :key = "index"
                :checkbox = "multiple"
                :radio = '!multiple'
                :checked = "updatedList.includes(p._id)"
                :title = "p.name"
                v-if="(!department || department == p.department) && (p && p._id !== myUserId)"
                name = "pcheckbox"
                :value = "p._id"
                :text = "(userDepartmentName(p._id) || '部门待定') + ' ' + (p.job || '职位待定')"
                @change="update"
            ></f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>
import {mapGetters} from 'vuex';
import axios from 'axios';
export default {
    name: 'directlyuserselector',

    props: {
        selectedList: {
            type: Array,
            default: () => { return [] }
        },
        title: {
            type: String,
            default: '选择员工'
        },
        department:{
            type:String,
            default:null,
        },
        multiple: {
            type: Boolean,
            default: true
        },
        isShowAll: {
            type: Boolean,
            default: false
        }
    },

    data: () => {
        return {
            pageId: 'personnelselector' + Math.floor(Math.random() * 100),
            userList:[],
            updatedList: []
        }
    },

    computed: {
        ...mapGetters([
            'personnel',
            'myProfile',
            'userDepartmentName',
            'myUserId'
        ])
    },

    mounted: function() {
        this.updatedList = this.selectedList.slice(0);
        this.load();
        this.$forceUpdate();
    },

    methods: {
        load(){
            let self=this;
            $preloader.show();
            if (this.isShowAll) {
                this.userList = this.personnel;
            } else {
                axios.get('api/user/getDirectlyUsers').then(resp => {

                    self.userList = resp.data;

                    $preloader.hide();
                });
            }
        },
        selectAll(event) {
            let inputs = $('#' + this.pageId + ' li:not(.hidden-by-searchbar) input[name=pcheckbox]');

            if (inputs.length > 1 && !this.multiple) {
                $alert('只能选择一位员工', '操作错误');
                return;
            }

            let uIds = [];
            inputs.each(function() { uIds.push(this.value)});

            if (event.target.checked) {
                uIds.forEach(id => {
                    if (!this.updatedList.includes(id)) {
                        this.updatedList.push(id);
                    }
                });
            } else {
                this.updatedList = this.updatedList.filter(id => !uIds.includes(id));
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
                    $alert('只能选择一位员工', '操作错误');
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
                $alert('只能选择一位员工', '操作错误');
            }
            this.$emit('submit', this.updatedList);
        },

        cancel() {
            this.$emit('cancel');
        }
    }
}
</script>

