<template>
    <f7-page style="background: #FFFFFF">
        <f7-navbar title="编辑数据报表" back-link></f7-navbar>
        <div>
            <div class="li-item" v-if="!(superAdmin && superAdmin._id == this.myProfile._id)" @click="jumpToUserDepartment">
                <img class="item-icon" src="../../assets/images/icon_their_department_black@2x.png">
                所在部门模板
                <img class="arrow-right" src="../../assets/images/arrow_right_gray@2x.png">
            </div>
            <div class="li-item" @click="departmentpickerShow=true">
                <img class="item-icon" src="../../assets/images/icon_subordinate_department_black@2x.png">
                下属部门模板
                <img class="arrow-right" src="../../assets/images/arrow_right_gray@2x.png">
            </div>
        </div>
        <f7-popup :opened="departmentpickerShow" @popup:closed="(departmentpickerShow = false)">
            <departmentpicker
                    :multiple="false"
                    :parentDepartmentId="parentDepartmentId"
                    @department:cancel="departmentpickerShow = false"
                    @department:selected="onSelectorDepartment"
            ></departmentpicker>
        </f7-popup>
    </f7-page>
</template>
<style scoped>
    .li-item{
        height: 55px;
        padding: 0 20px;
        border-bottom: 1px solid #d8d8d8;
        font-size: 16px;
        line-height: 55px;
    }
    .li-item .item-icon{
        float: left;
        position: relative;
        top: 17px;
        width: 21px;
        height: 21px;
        margin-right: 5px;
    }
    .li-item .arrow-right{
        position: relative;
        float: right;
        top: 22px;
        width: 8px;
        height: 12px;
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {defaultImgUrl} from 'lib/loading';
    import {loadAvatar} from 'lib/utils';
    import departmentpicker from 'gadget/departmentpicker.vue';
    export default {
        components: {
            departmentpicker
        },
        data: () => {
            return {
                avatarUrl: defaultImgUrl,
                departmentpickerShow:false,
                parentDepartmentId:'',
                departmentList:[],

            };
        },
        props: [
            'lastPage',
        ],
        computed: {
            ...mapGetters([
                'myCompany',
                'departments',
                'myProfile',
                'superAdmin',
                'companyName',
                'isDepartmentAdmin',
                'userDepartment',
            ]),
            isSuperAdminOrDepartmentAdmin(){
                if (this.myProfile._id){
                    return this.isDepartmentAdmin(this.myProfile._id) ||(this.superAdmin && this.superAdmin._id == this.myProfile._id);
                }
            },
        },
        mounted: function() {

            if (!this.parentDepartmentId && this.superAdmin._id != this.myProfile._id && this.isDepartmentAdmin(this.myProfile._id)){
                this.parentDepartmentId =  this.userDepartment(this.myProfile._id).departmentId;
            }
        },

        methods: {
            jumpTo(path, properties) {
                this.$f7router.navigate(path, {
                    props: properties
                });
            },
            jumpToUserDepartment() {

                this.jumpTo('/report/report/',{'departmentId': this.userDepartment(this.myProfile._id).departmentId})
            },
            onSelectorDepartment(ids) {
                if (ids && ids[0]) {
                    this.departmentpickerShow = false;
                    this.jumpTo('/report/report/',{'departmentId':ids[0].toString()})
                }
            },
        },
    };
</script>
