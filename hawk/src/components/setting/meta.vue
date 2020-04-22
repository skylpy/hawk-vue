<template>
    <f7-page>
        <f7-navbar :title="navTitle + '设置'" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="submit">保存</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title>{{navTitle}}列表</f7-block-title>
        <f7-list>
            <f7-list-item
                v-for="(item, i) in myCompany[dataType]"
                :key="i"
                :title="item">
                <div>
                    <f7-button 
                        fill 
                        style="display:inline-block"
                        @click="modify(item)">编辑</f7-button>
                    <f7-button 
                        fill 
                        color="red"
                        style="display:inline-block"
                        @click="remove(item)">删除</f7-button>  
                </div>
            </f7-list-item>
        </f7-list>

        <f7-block>
            <f7-link href="#" @click="add"> 新增{{navTitle}} </f7-link>
        </f7-block>
        
    </f7-page>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';

export default {
    props: {
        lastPage: {
            type: String,
            default: '上一页'
        },
        navTitle: {
            type: String,
            default: '元数据管理',
            required: true
        },
        dataType: {
            type: String,
            required: true
        }
    }, 

    data: () => {
        return {
            dataList: []
        }
    },

    computed: {
        ...mapGetters([
            'myCompany'
        ]),
    },

    methods: {
        ...mapMutations({
            'update': 'COM_UPDATE'
        }),

        ...mapActions({
            'save': 'SAVE_COM_KEY'
        }),

        submit() {
            $dialog.confirm('确定保存修改吗？', '保存设置', () => {
                let pl = $dialog.preloader('正在保存设置');

                this.save([this.dataType]).then(() => {
                    $dialog.close();
                    $dialog.alert('成功保存' + this.navTitle, '操作成功');
                }).catch((err) => {
                    $dialog.close();
                    $dialog.alert('无法保存设置，请联系管理员', '操作失败');
                });
            });
        },

        add() {
            $dialog.prompt('请填写新的类型名称', '增加类型', (val) => {
                if (!val) { return; }
                let typeList = this.myCompany[this.dataType].slice();
                typeList.push(val);
                let content = {}; content[this.dataType] = typeList;
                this.update(content);
            })
        },

        modify(item) {
            let ty = item;

            $dialog.prompt('请填写新的类型名称', '修改类型', val => {
                let typeList = this.myCompany[this.dataType].filter(v => {
                    return v != ty;
                });
                typeList.push(val);
                let content = {}; content[this.dataType] = typeList;
                this.update(content);
            });
        },

        remove(item) {
            let ty = item;

            $dialog.confirm('确定要删除类型"' + ty + '"?', '删除类型', () => {
                let typeList = this.myCompany[this.dataType].filter(v => {
                    return v != ty;
                });
                let content = {}; content[this.dataType] = typeList;
                this.update(content);
            })
        }
    }
}
</script>
