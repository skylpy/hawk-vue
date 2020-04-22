<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link icon-only @click="cancel">
                    <i class="icon icon-back"></i>
                </f7-link>
            </f7-nav-left>
            <f7-nav-title>部门选择</f7-nav-title>
        </f7-navbar>

        <f7-list class="hawk-org">
            <f7-list-item>
                <div slot="inner" class="hawk-org-department-nav">
                    <f7-link
                        v-for="(d, index) in chain"
                        :key="index"
                        @click="goto_department(d)"
                    > {{d.name}} </f7-link>
                </div>

            </f7-list-item>

            <f7-list-item divider></f7-list-item>

            <!--<f7-list-item>-->
                <!--<f7-link @click="create_department">-->
                    <!--<div>-->
                        <!--<i class="fa fa-lg fa-plus-circle" aria-hidden="true"></i>-->
                        <!--<span>新建部门</span>-->
                    <!--</div>-->
                <!--</f7-link>-->
            <!--</f7-list-item>-->

            <f7-list-item v-if="department.sub.length" divider></f7-list-item>

            <f7-list-item
                v-for="(sub, index) in department.sub"
                :key="index + 'department'"
            >
                <div slot="inner">
                    <f7-link class="hawk-select-radio" @click="toggle_department(sub)">
                        <i v-if="!has_selected(sub)" class="fa fa-lg fa-circle-thin" aria-hidden="true" style="color:#979797"></i>
                        <i v-if="has_selected(sub)" class="fa fa-lg fa-check-circle-o" aria-hidden="true"></i>
                    </f7-link>
                    <div style="display:inline-block">{{ sub.name + `（${sub.employees.filter(uid => !!who(uid)).length}人）` }}</div>
                </div>

                <f7-link slot="inner" class="sub-department-link" @click="goto_department(sub)">
                    <img :src="sub_icon" class="sub-department">
                    <span>下级</span>
                </f7-link>

            </f7-list-item>
            <div v-show="department.sub.length == 0" class="no_template">
                <img :src="zero_employee_icon" width="71px" height="84px">
                <p>暂无子部门</p>
            </div>
        </f7-list>

        <f7-toolbar>
            <div id="hawk-departmentpicker-selected-container">
                <div v-for="(d, index) in selected" :key="index">
                    <f7-button class="hawk-selected-tag" :text="d.name"></f7-button>
                    <i class="fa fa-times-circle" aria-hidden="true" @click="toggle_department(d)"></i>
                </div>
            </div>
            <f7-button v-if="selected.length < 1" class="hawk-button hawk-button-invalid">确定</f7-button>
            <f7-button v-if="selected.length" class="hawk-button" @click="done">确定</f7-button>
        </f7-toolbar>

    </f7-page>
</template>

<style lang="scss" scoped>
.hawk-select-radio {
    display: inline-block;
    padding-right: 10px;
}

.sub-department-link {
    padding-left: 15px;
    border-left: solid 1px rgba(216,216,216,1);

    .sub-department {
        width:16px;
        height:16px;
        padding-right:3px
    }
}
.no_template{
    text-align: center;
    margin: 120px 0px auto;
}
.no_template p{
    font-size: 14px;
    color: #333333;
    margin: 5px 0;
}

#hawk-departmentpicker-selected-container {
    display: flex;

    div {
        position: relative;

        .hawk-selected-tag {
            color: #01B38B;
            border: solid 1px #01B38B;
            margin-right: 10px;
        }

        i {
            position: absolute;
            top: -5px;
            right: 5px;
        }
    }
}
</style>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'departmentpicker',

    props: {
        multiple: {
            type: Boolean,
            default: true
        },
        showParentDepartment: {
            type: Boolean,
            default: false
        },
        parentDepartmentId: ''
    },
    watch:{
        parentDepartmentId(val){
            this.load()
        },
    },
    data() {
        return {
            chain: [],
            sub_icon: require('assets/images/icon_truee_green@2x.png'),
            zero_employee_icon: require('assets/images/ill_no_data@2x.png'),
            selected: []
        }
    },

    computed: {
        ...mapGetters([
            'organization',
            'superAdmin',
            'myProfile',
            'who'
        ]),

        IamSuperAdmin(){
            if (this.myProfile._id && this.superAdmin){
                return this.superAdmin._id == this.myProfile._id
            }
        },

        navTitle() {
            return this.department.name || '公司';
        },

        department() {
            if (this.chain.length) return this.chain[this.chain.length-1];
            return this.organization;
        },

        reminder() {
            return this.department.admin.length == 0 && this.department.name != '公司';
        },

        parent_department() {
            let index = this.chain.findIndex(d => d.departmentId == this.department.departmentId);
            if (index < 1) return null;
            return this.chain[index-1];
        },
    },

    created() {
        this.load();
    },

    methods: {
        ...mapActions({
            'update': 'UPDATE_COMPANY'
        }),

        departments(root) {
            return (function listD(d) {
                return d.sub.slice(0).concat(d.sub.reduce((accum, s) => { return accum.concat(listD(s)) }, []));
            })(root);
        },

        load() {
            let rootD =  this.organization;
            if (this.parentDepartmentId && !this.IamSuperAdmin){
                if (this.showParentDepartment){
                    let parent = this.departments(this.organization).find(d => d.departmentId == this.parentDepartmentId);
                    rootD = {
                        name:"公司"
                    };
                    rootD.sub=[JSON.parse(JSON.stringify(parent))]
                } else {
                    rootD = this.departments(this.organization).find(d => d.departmentId == this.parentDepartmentId);
                }
            }

            this.chain = [rootD];
        },

        has_selected(d) {
            return this.selected.findIndex(i => i.departmentId == d.departmentId) != -1;
        },

        create_department() {

            $prompt('请输入部门名称', '新建部门', (name) => {
                if (!name) {
                    $alert('部门名称不能为空', '操作错误');
                    return;
                }

                let organization = deepCopy(this.organization);
                let departments = this.departments(organization);
                let department = departments.find(d => d.departmentId == this.department.departmentId);

                department.sub.push({
                    departmentId: Date.now(),
                    name,
                    sub: [],
                    employees: [],
                    admin: []
                });

                $preloader.show();
                this.update({ organization }).then(() => {
                    $preloader.hide();
                    this.load();
                    this.$emit('department:add');
                }).catch(err => {
                    $alert(err.message, '操作错误');
                })
            })
        },

        goto_department(d) {
            let pos = this.chain.findIndex(item => item.departmentId == d.departmentId);

            if (pos == -1) {
                this.chain.push(d);
                return;
            }

            if (pos == this.chain.length - 1) return;

            this.chain.splice(pos+1);
        },

        toggle_department(d) {
            let index = this.selected.findIndex(i => i.departmentId == d.departmentId);

            if (index == -1) {
                if (!this.multiple) this.selected = [];
                this.selected.push(d);
            }
            else this.selected.splice(index, 1);
        },

        done() {
            let selectedDepartmentIds = this.selected.map(i => i.departmentId);
            this.$emit('department:selected', selectedDepartmentIds);
        },

        cancel() {
            this.$emit('department:cancel');
        }
    }
}
</script>

