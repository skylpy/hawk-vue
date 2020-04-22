<template>
    <f7-page style="background:white">
        <f7-navbar title="通讯录" back-link>
        </f7-navbar>

        <f7-searchbar
            disable-button
            placeholder="输入名字、部门或职位"
            search-container=".p-list"
            search-in=".depart, .name"
            disable-button-text="取消"
        ></f7-searchbar>

        <f7-block-title>员工列表</f7-block-title>
        <f7-list class="p-list">
            <f7-list-item
                v-for = "(p, index) in personnel"
                :key = "index"
                name = "p-checkox"
            >
                <div class="task-contact-list" >
                    <img class="avatar" :src="p.avatarUrl || avatar">
                    <div class="info">
                        <p class="name">{{p.name}}</p>
                        <p class="depart">{{ (userDepartmentName(p._id) || '') + ' ' + (p.job || '') }}</p>
                    </div>
                    <div v-if="!p.phoneHidden"
                         class = "contact-btn"
                         slot="inner"
                         @click="phonecall(p.phone)">
                        <img :src="phoneIcon">

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <!--电话-->
                    </div>
                    <div
                            class="contact-btn"
                            style="min-width:initial;"
                            @click="goChat(p)">
                        <img :src="chatIcon">
                        <!--聊天-->
                    </div>
                </div>
            </f7-list-item>
        </f7-list>

    </f7-page>
</template>

<style lang="scss" scoped>
.task-contact-list {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    overflow: hidden;

    .avatar {
        width: 35px;
        height: 35px;
        margin-right: 10px;
        display: block;
        border-radius: 4px;
    }

    .info {
        flex: 1;
    }

    .name {
        max-width: 100px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin: 0;
        font-size: 16px;
        color: #333;
    }

    .depart {
        margin: 0;
        font-size: 13px;
        color: #666;
    }

    .contact-btn {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #01B38B;
        margin-left: 20px;

        img {
            width: 17px;
            height: 17px;
            display: block;
            margin-right: 5px;
        }
    }
}

</style>


<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import {call} from 'lib/phonecall';

export default {
    props: {
        lastPage: {
            type: String,
            default: '上一页'
        }
    },

    data: () => {
        return {
            phoneIcon: require('assets/images/icon_phone_call_green@2x.png'),
            chatIcon: require('assets/images/icon_chat_green@2x.png'),
            avatar: require('assets/images/hp_default_70@2x.png')
        }
    },

    mounted: function() {
        // $preloader.show('正在更新数据');
        //
        // this.load('phone').then(() => {
        //     $preloader.hide();
        //
        //     this.$forceUpdate();
        // }).catch((err) => {
        //     $preloader.hide();
        //     $alert('无法更新数据', '操作失败');
        // });
    },

    computed: {
        ...mapGetters([
            'personnel',
            'myUserId',
            'userDepartment',
            'userDepartmentPath',
            'userDepartmentName',
            'superAdmin',

        ]),

        contactList() {

            console.log(this.personnel)
            return this.personnel
            // if (this.superAdmin._id == this.myUserId) return this.personnel;
            //
            // let department = this.userDepartment(this.myUserId);
            // if (!department) return [];
            //
            // let contacts = this.personnel.filter(p => department.employees.includes(p._id));
            // let path = this.userDepartmentPath(this.myUserId);
            //
            // if (path.length >= 2 && department.admin.includes(this.myUserId)) {
            //
            //     // add my superviser if i am department admin
            //     let parent_department = path[path.length-2];
            //     contacts.push(...this.personnel.filter(p => parent_department.admin.includes(p._id)));
            // }

            // return contacts;
        }
    },

    methods: {
        // ...mapActions({
        //     load: 'LOAD_PERSONNEL_KEY'
        // }),
        goChat(item){
            this.$f7router.navigate("/chat/chat", {props:{targetId:item._id, conversationType:'PRIVATE'}});
        },
        phonecall(n) {
            return call(n);
        }
    }

}
</script>
