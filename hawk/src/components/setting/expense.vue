<template>
    <f7-page>
        <f7-navbar title="报销类型" back-link>
            <f7-nav-right>
                <span @click="addType">添加</span>
            </f7-nav-right>
        </f7-navbar>

        <f7-list>
            <f7-list-item  v-for="(v, i) in list" :key="i" :title="v">
                <f7-list-button color="red" @click="deleteType(i)">删除</f7-list-button>
            </f7-list-item>
        </f7-list>
    </f7-page>
</template>

<script>
import axios from 'axios'
export default {
    name: "expense",
    data () {
        return {
            list: ['差旅', '交通', '其他'],
            isCreate: true
        }
    },
    methods: {
        addType () {
            $prompt('请输入报销类型', '新建报销类型', (name) => {
                if (!name) {
                    $alert('报销类型名称不能为空', '操作错误');
                    return;
                }
                let type = Object.assign([], this.list)
                type.push(name)

                axios[this.isCreate ? 'put' : 'post']('/api/expenseset/', {type: type}).then(resp=>{
                    this.list.push(name)
                    this.isCreate = false
                }).catch(err => {
                    console.error(err);
                });
            })
        },
        deleteType(index) {
            $confirm('您确定要删除该费用类型吗？', () => {
                $preloader.show();
                let type = Object.assign([], this.list)
                type.splice(index, 1)
                axios.post('/api/expenseset/', {type: type}).then(resp => {
                    $preloader.hide();
                    $alert('操作成功！')
                    this.list.splice(index, 1)
                    this.isCreate = false
                }).catch(err => {
                    $preloader.hide();
                    $alert('操作失败！')
                })
            })
        }
    },
    created() {
        axios.get('/api/expenseset/').then(resp=>{
            console.log(resp.data)
            if (resp.data && resp.data.type) {
                this.list = resp.data.type
                this.isCreate = false
            }
        }).catch(err => {
            console.error(err);
        });
    }
}
</script>

<style scoped>

</style>
