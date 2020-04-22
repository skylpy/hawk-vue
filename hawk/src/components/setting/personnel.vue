<template>
    <f7-page>
        <f7-navbar title="员工管理" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="add">新增员工</f7-link>
            </f7-nav-right>
            <f7-subnavbar :inner="false">
                <f7-searchbar
                    disable-button
                    placeholder="输入名字、部门或职位"
                    search-container=".contacts-list"
                    search-in=".item-title, .item-text"
                ></f7-searchbar>
            </f7-subnavbar>
        </f7-navbar>

        <div v-if="!loadError">
            <f7-block-title>员工列表</f7-block-title>

            <f7-list-index
                indexes="auto"
                list-el=".list.contacts-list"
                :scroll-list="true"
                :label="true">
            </f7-list-index>

            <f7-list contacts-list>
                <f7-list-group media-list v-for="(group, i) in filteredList" :key="i">
                    <f7-list-item 
                        :title="group.letter.toUpperCase()" 
                        group-title>
                    </f7-list-item>
                    <f7-list-item 
                        v-for="(p, j) in group.data" 
                        :key="j"
                        :title="p.name" 
                        :text="(userDepartmentName(p._id) || '部门待定') + ' ' + (p.job || '职位待定')"
                        link="#"
                        after="更多"
                        @click="getProfile($event, p._id)"></f7-list-item>
                </f7-list-group>
            </f7-list>
        </div>
        <div style="text-align: center" v-else>
            <p style="color: red">{{loadError}}</p>
        </div>

    </f7-page>
</template>

<script>
import {pySegSort} from 'lib/utils';
import {mapGetters, mapActions} from 'vuex';

export default {
    data: () => {
        return {
            keywords: [],
            loadError: ''
        }
    },

    computed: {
        ...mapGetters([
            'personnel',
            'IamAdmin',
            'userDepartmentName'
        ]),

        filteredList() {
            if (!this.personnel) {
                return []; // loading
            }

            let pList = this.personnel.filter((p) => {
                // filtering by keywords
                return true;
            })
            let nameList = [];
            pList.forEach((p) => {
                nameList.push(p.name);
            });

            let sortList = pySegSort(nameList);

            sortList.forEach((group) => {
                let data = group.data;
                let personAry = [];
                data.forEach((name) => {
                    this.personnel.forEach((p) => {
                        if (p.name == name) {
                            personAry.push(p);
                        }
                    });
                });
                group.data = personAry;
            })

            return sortList;
        },
    },

    mounted: function() {

        if (this.personnel.length == 0) {
            let pl = $dialog.preloader("正在读取员工列表...");

            this.load().then(() => {
                this.loadError = '';
                $dialog.close();
            }).catch((err) => {
                console.error(err);
                this.loadError = "无法加载员工列表";
                $dialog.close();
            });
        }
    },

    methods: {
        ...mapActions({
            'load' : 'LOAD_PERSONNEL'
        }),
        add() {
            this.$f7router.navigate('/setting/profile/');
        },
        getProfile(ev, uId) {
            if (uId) {
                this.$f7router.navigate('/setting/profile/', {
                    props: {
                        lastPage: '员工管理',
                        uId: uId
                    }
                }); 
            }
        }
    },
}
</script>
