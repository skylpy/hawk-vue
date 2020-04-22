<template>
    <f7-page>

        <f7-navbar :title="`${name}设置`" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="$f7router.back()">取消</f7-link>
                <f7-link href="#" @click="submit">保存</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <f7-block-title style="white-space: pre-wrap">
            <span v-for="(node, index) in path" :key="index">
                <f7-link 
                    href="#"
                    @click="back(index)">{{node.name || '未知'}}</f7-link>
                <span v-if="(index+1) < path.length"> > </span>
            </span>
        </f7-block-title>

        <f7-list>
            <f7-list-group media-list>
                <f7-list-item 
                        :title="`子${name}列表`" 
                        group-title>
                    </f7-list-item>
                <f7-list-item 
                    v-for="(n, index) in (current && current.children || [])" 
                    :title="n.name" 
                    :key="index"
                    link="#" 
                    @click="forward(n)">
                </f7-list-item>
            </f7-list-group>

            <f7-block
                v-if="!current || current.children.length == 0"
                style="text-align:center; font-size:small; color:gray"
            >
                没有任何子{{name}}
            </f7-block>
        </f7-list>

        <f7-block style="display:flex">
            <f7-link style="flex:auto" href="#" @click="add">新增{{name}}</f7-link>
            <f7-link style="flex:auto" v-if="current != root" href="#" @click="modify">更改{{name}}</f7-link>
            <f7-link style="flex:auto" v-if="current != root" href="#" @click="remove">删除{{name}}</f7-link>
        </f7-block>

    </f7-page>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import {Vue} from 'vue';

export default {
    props: ['lastPage', 'name', 'src'],

    data: () => {
        return {
            root: null,
            path: []
        }
    },

    computed: {
        ...mapGetters([
            'myCompany'
        ]),

        current() {
            if (this.path && this.path.length > 0) return this.path[this.path.length-1];
            return null;
        },

        tree() {
            return this.myCompany[this.src];
        },
    },

    mounted: function() {
        this.root = this.tree && deepCopy(this.tree) || {};
        this.path.push(this.root);
    },

    methods: {
        back(index) {
            if (index < 0 || index >= (this.path.length - 1)) return;
            this.path.splice(index+1);
            this.$forceUpdate();
        },

        forward(node) {
            this.path.push(node);
            this.$forceUpdate();
        },

        submit() {
            $dialog.confirm('确定保存修改？', `更新${this.name}设置`, () => {
                $dialog.preloader('正在保存设置');

                let update = {};
                update[this.src] = deepCopy(this.root);
                this.update(update);

                this.save([this.src]).then(() => {
                    $dialog.close();
                    $dialog.alert(`${this.name}设置已经保存`, '操作成功');
                }).catch((err) => {
                    $dialog.close();
                    $alert(err.message, '操作失败');
                });
            });
        },

        add() {
            $dialog.prompt(`请填写${this.name}名称`, '创建"'+ this.current.name + '"的子' + this.name, (name) => {

                if (name) {
                    let existing = this.current.children.find(i => i.name == name);
                    if (existing) {
                        $alert(`不能有同名的${this.name}存在`, '操作错误');
                        return;
                    };

                    this.current.children.push({
                        id: Date.now() + "",
                        name: name,
                        children: []
                    });

                    let self = this;
                    $alert(this.name + '新增成功，请注意保存设置', '操作成功', () => {
                        self.$forceUpdate();
                    });
                }
            });
        },

        modify() {
            $dialog.prompt(`请填写该${this.name}的新名称`, `更改${this.name}名称`, (name) => {
                if (name) {
                    let existing = this.current.children.find(i => i.name == name);
                    if (existing) {
                        $alert(`不能有同名的${this.name}存在`, '操作错误');
                        return;
                    };

                    this.current.name = name;
                    let self = this;
                    $alert(this.name + '更改成功，请注意保存设置', '操作成功', () => {
                        self.$forceUpdate();
                    });
                }
            });

        },

        remove() {
            if (this.current.id == "0" || this.current == this.root) {
                $alert('不能删除根节点', '操作错误');
                return;
            };

            $dialog.confirm(`删除${this.current.name}以及所有关联的子${this.name}？`, '确认删除操作', () => {
                let toRemove = this.path.pop();
                let index = this.current.children.findIndex(i => i.id == toRemove.id);
                this.current.children.splice(index, 1);

                let self = this;
                $alert(this.name + '删除成功，请注意保存设置', '操作成功', () => {
                    self.$forceUpdate();
                });
            });
        },
        ...mapMutations({
            'update': 'COM_UPDATE',
        }),
        ...mapActions({
            'save': 'SAVE_COM_KEY'
        })
    }, // methods
}
</script>
