<template>
    <f7-page>
        <f7-navbar title="权限管理" back-link>
        </f7-navbar>

        <f7-list id="hawk-privilege-table">
            <f7-list-item divider></f7-list-item>
            <f7-list-item
                title="设置部门管理员"
                link="#"
                @click="$f7router.navigate('/office/privilegeadmin/')"
            >
                <div class="hawk-privilege-notes" slot="content">超级管理员可以设置部门管理员并分配对应的权限</div>
            </f7-list-item>

            <f7-list-item
                title="设置财务人员"
                link="#"
                @click="$f7router.navigate('/office/privilegefinance/')"
            >
                <div class="hawk-privilege-notes" slot="content">超级管理员可以设置财务人员并分配对应的权限</div>
            </f7-list-item>

            <f7-list-item
                title="设置行政人员"
                link="#"
                @click="$f7router.navigate('/office/privilegeadministrative/')"
            >
                <div class="hawk-privilege-notes" slot="content">超级管理员可以设置行政人员并分配对应的权限</div>
            </f7-list-item>

            <f7-list-item
                title="设置超级管理员（老板）"
                link="#"
                @click="$f7router.navigate('/office/privilegesuperadmin/')"
            >
                <div class="hawk-privilege-notes" slot="content">更换超级管理员权限，更换之后将不会再有权限</div>
            </f7-list-item>

            <f7-list-item
                title="设置临时权限"
                link="#"
                @click="$f7router.navigate('/office/privilegetemporary/')"
            >
                <div class="hawk-privilege-notes" slot="content">可以设置让员工拥有临时权限，临时权限到期自动取消</div>
            </f7-list-item>

        </f7-list>

    </f7-page>
</template>

<style lang="scss">
#hawk-privilege-table, #hawk-privilege-edit-admin {
    margin-top: 0;
    font-size: 16px;
    color: #333333;

    .hawk-privilege-notes {
        font-size: 12px;
        height: 40px;
        padding: 15px 0 0 15px;
        color: #999999;
        background: rgba(248,248,248,1);
    }

    .item-title {
        padding-left: 15px;
    }

    .item-inner:after {
        background-color: white;
    }

    .item-content {
        padding-left: 0;
        display: block;
    }

    .item-divider:before {
        background-color: white;
    }
}

</style>

<script>
export default {
    data() {
        return {

        }
    },

    methods: {

    }
}
</script>
