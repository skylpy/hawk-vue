<template>
    <f7-page :id="pageId">
        <f7-navbar :title="title">
            <f7-nav-right>
                <f7-link href="#" @click="cancel">取消</f7-link>
            </f7-nav-right>
        </f7-navbar>
        <f7-list>
            <f7-list-item  v-for="(item, i) in items" :key="i">
                <i class="f7-icons" slot="inner" style="color: red;" @click="del(i)">delete_round</i>
                <input slot="inner" readonly style=" width:50%" type="text" v-model="item.name" placeholder="填写表头">
                <span slot="inner" class="unit" @click="updateUnit(i)">{{item.targetValue == ''||item.targetValue == undefined?'请填写':'达标：'+item.targetValue+item.unit+''}}</span>
                <i class="f7-icons" @click="updateUnit(i)" >chevron_right</i>

            </f7-list-item>
            <f7-list-item @click="addItem">
                <i class="f7-icons" slot="inner" style="color: #2196f3;">add_round</i>
                <span slot="inner" class="add_item">新增表头</span>
            </f7-list-item>
            <f7-list-item divider>
            </f7-list-item>
            <f7-list-item class="save_tmp">
                <span slot="inner" @click="saveAsTemplate">保存为模板</span>
            </f7-list-item>
            <f7-list-item divider>
            </f7-list-item>
            <f7-list-item class="save_tmp" title="选择模板" >
                <input style="text-align:right; width: 60%"
                       :input-id = "`worktime-start`"
                       type="text"
                       readonly
                       :value="selectTmp"
                       placeholder="选择模板"
                       @click="openPicker($event, selectTmp)"/>
                <i class="f7-icons" @click="openPicker($event, selectTmp)">chevron_right</i>
            </f7-list-item>

        </f7-list>
        <div class="save_button">
            <f7-button class="hawk-button" big-ios   style="border-radius:unset;" @click="submit">保存</f7-button>
        </div>
        <vodal class="date-modal" :show="dateDialog" animation="zoom" measure="px" :width=250 :height=280 :closeButton=false>
            <div class="modal-title">添加数据项</div>
            <div class="modal-form">
                <input v-model="formItem.name" placeholder="请输入数据名称">
                <input v-model="formItem.unit" placeholder="请输入数据单位">
                <input v-model="formItem.targetValue" type="number" placeholder="请输入达标值(数字)">
                <div class="score_bt" @click="setScore(formItem)">考核设置</div>
            </div>
            <div class="modal-button">
                <div class="modal-cancel" @click="dateDialog=false">取消</div>
                <div class="modal-save" @click="saveItem">确定</div>
            </div>
        </vodal>
        <vodal class="date-modal" :show="ruleDialog" animation="zoom" measure="px" :width=250 :height=340 :closeButton=false>
            <div class="modal-title">考核设置 (达标:{{editItemRule.targetValue}}{{editItemRule.unit}})</div>
            <div class="modal-form score_rule_con" ref="score_rule_scroll">
                <div class="score_rule_item" v-for="(item,index) in editRule" :key="index">
                    <p>数值：<input type="number" @input="item.valueType= parseFloat(editItemRule.targetValue) <= parseFloat((item.unitValue || 0)) ?'add':'sub'" v-model="item.unitValue" placeholder="请输入数据"></p>
                    <p>{{item.valueType=='add'?'加分':'扣分'}}：<input type="number" v-model="item.value" placeholder="请输入达标值(数字)"></p>
                    <div class="score_del" @click="delRule(index)">删除</div>
                    <!--<div style="margin-bottom: 10px;">-->
                        <!--<f7-radio :name="'valueType_'+index" @change="item.valueType='add'" :checked="item.valueType=='add'"></f7-radio> 加分-->
                        <!--<f7-radio :name="'valueType_'+index" @change="item.valueType='sub'" :checked="item.valueType=='sub'"></f7-radio> 扣分-->
                    <!--</div>-->
                </div>
            </div>
            <div class="score_bt" @click="addRule(editItemRule)">添加</div>
            <div class="modal-button">
                <div class="modal-cancel" @click="colseScore">关闭</div>
                <div class="modal-save" @click="saveScore">确定</div>
            </div>
        </vodal>
    </f7-page>
</template>
<style scoped>
.save_button{
    position: fixed;

    width: 100%;
    bottom: 0px;
}
.add_item{
    display:block;text-align: left; width:100%
}
.score_rule_con{
    height: 220px;
    overflow-y: auto;
}
.score_rule_item:last-child{
    border-bottom: none;
}
.score_rule_item{
    border-bottom: 1px solid #A7A7A7;
    margin: 10px 0px;
    /*padding-top: 10px;*/
}
.score_rule_item input{
    width: 180px!important;
    margin-bottom: 0px!important;
    display: inline;
}
.score_bt{
    text-align: center;
    padding: 8px 10px;
    background-color: #01B38B;
    border-radius: 2px;
    color:white;
    cursor: pointer;
}
.score_del{
    width: 30px;
    text-align: center;
    padding: 2px 8px;
    background-color: #e05a50;
    border-radius: 2px;
    color:white;
    cursor: pointer;
    margin: 10px 10px 10px auto;
}
.score_tmp{
    border-top-color: #DDDDDD;border-top-style: solid;border-top-width: 1px
}
.score_tmp span{
    display:block;text-align: center; width:100%;color: #e05a50;
}
.save_tmp{
    border-top-color:#DDDDDD;border-top-style: solid;border-top-width: 1px
}
.save_tmp span{
    display:block;text-align: center; width:100%;color:#01B38B;
}
.unit{
    text-align: right;
    width:40%;
    color: #A7A7A7;
    margin-right: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;/*文本不换行*/
}
.f7-icons{
    display:block;
    margin-right: 10px;
    font-size: 1em;
    color: #A7A7A7;
}
.date-modal{
    /*position: relative;*/
}

.modal-title{
    text-align: center;
    font-weight: 500;
    font-size: 16px;
    color: #333;
}
.modal-form{
    /*margin-top: 10px;*/
    margin: 15px auto 10px auto;
}
.modal-form input{
    margin-bottom: 15px;
    font-size: 15px;
    color: #333333;
    width: 100%;
    height: 40px;
    border-radius:5px;
    padding-left: 10px;
    border:1px solid rgba(213,213,213,1);
    box-sizing: border-box;
}
.modal-button{
    position: absolute;
    width: 100%;
    margin-top: 10px;
    margin-left: -15px;
    height: 44px;
    bottom: 0px;
    border-top: 1px solid #D8D8D8;
    font-size: 16px;

}
.modal-button .modal-save{
    float: right;
    width: 50%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #01B38B;

}
.modal-button .modal-cancel{
    width: 50%;
    float: left;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-right: 1px solid #D8D8D8;
    box-sizing: border-box;
    color: #333;
}
</style>
<script>
import {mapGetters,mapMutations,mapActions} from 'vuex';
import Vodal from 'vodal';
export default {
    name: 'datatemplate',
    components: {
        Vodal
    },
    props: {
        oldItems: {
            type: Array,
            default: () => { return [] }
        },
        title: {
            type: String,
            default: '制定数据项目'
        },
    },

    data: () => {
        return {
            pageId: 'datatemplate' + Math.floor(Math.random() * 100),
            formItem:{},
            dateDialog:false,
            ruleDialog:false,
            editItemRule:{},
            editRule:[],
            items:[
                {name:'今日营业额',unit:'元',targetValue:100, score:[]},
                {name:'今日客户数',unit:'个',targetValue:10, score:[]},
            ],
            dataType:'reportItemTemplates',
            selectTmp:'',
            updatedList: []
        }
    },

    computed: {
        ...mapGetters([
            'myCompany',
            'personnel',
            'departmentName'
        ])
    },

    mounted: function() {
        let tmpList = this.myCompany[this.dataType].slice();
        let nameList = [];
        for (let i in tmpList){
            nameList.push(tmpList[i].name);
        }
    },
    watch:{
      oldItems: {
          handler (val) {
              if (val && val.length>0){
                  this.items = [];
                  for (let i in val){
                      this.items.push(Object.assign({},val[i]))
                  }
              }
          },
          immediate: true
      }
    },
    methods: {
        setScore(editItem){
            this.editItemRule = editItem
            this.editRule = editItem.score.slice(0)
            this.ruleDialog = true
        },
        colseScore(){
            this.ruleDialog = false
        },
        addRule(item, rule){
            let data = rule || {
                rule: 'report_custom',
                unitValue: item.targetValue,
                valueType: 'add',
                value: 10
            }
            this.editRule.push(data);
            this.$nextTick(() => {
                window.jQuery('.score_rule_con').animate({'scrollTop': this.$refs.score_rule_scroll.scrollHeight}, 500)
            });
        },
        delRule(index){
            this.editRule.splice(index, 1);
        },
        saveScore(){
            this.ruleDialog = false
            this.editItemRule.score = this.editRule
        },
        openPicker(ev, when) {
            let input = ev.target;

            // if (input.picker) {
            //     input.picker.open();
            //     return;
            // }
            let tmpList = this.myCompany[this.dataType].slice();

            let nameList = [""];
            for (let i in tmpList){
                nameList.push(tmpList[i].name);
            }
            let self = this;
            input.picker = this.$f7.picker.create({
                inputEl: '#' + input.id,
                toolbarCloseText: '完成',
                rotateEffect: true,
                cols: [{textAlign: 'center', values: nameList}],
                on: {
                    change: function (picker, values, displayValues) {
                        self.selectTmp = values;
                        if (self.getTemplateItem(values[0])) {
                            self.items =  self.getTemplateItem(values[0]).items;
                        }
                    },
                }
            });

            input.picker.open();

        },
        getTemplateItem(key){
            let tmpList = this.myCompany[this.dataType].slice();
            for (let i in tmpList){
                if (tmpList[i].name == key){
                    let tem = tmpList[i];
                    let newTmp = {name:tem.name,items:[]};
                    for (let i in tem.items){
                        newTmp.items.push(Object.assign({},tem.items[i]))
                    }
                    return newTmp
                }
            }
        },
        ...mapMutations({
            'update': 'COM_UPDATE'
        }),
        ...mapActions({
            'save': 'SAVE_COM_KEY'
        }),
        saveAsTemplate(){
            let self = this;
            let datas = self.items;
            let itemNames = [];
            for (let i in datas){
                if (!datas[i].name || !datas[i].unit){
                    $dialog.alert('请先填写完整数据项', '操作失败');
                    return;
                }
                if (itemNames.indexOf(datas[i].name) != -1 ){
                    $dialog.alert('数据项名称不能重复', '操作失败');
                    return;
                }else {
                    itemNames.push(datas[i].name)
                }
            }
            $dialog.prompt('请填写模板名称', '新建模板', val => {
                if (!val) {
                    return;
                }

                let typeList = this.myCompany[this.dataType].slice();
                for (let i in  typeList){
                    if (val == typeList[i].name){
                        $dialog.alert('该名称的模板已存在，请更换名称后重试', '提示');
                        return;
                    }
                }
                let itemList = [];
                for (let i in this.items){
                    itemList.push(Object.assign({},this.items[i]))
                }
                let tmp = {name:val,items: itemList};
                typeList.push(tmp);
                let content = {};
                content[this.dataType] = typeList;
                this.update(content);
                this.save([this.dataType, '_id']).then(() => {
                    $dialog.alert('成功保存' , '操作成功');
                }).catch((err) => {
                    $dialog.alert('无法保存，请联系管理员', '操作失败');
                });
            });
        },
        del(key){
            this.items.splice(key,1);
        },
        addItem(){
            this.formItem = {score:[]};
            this.dateDialog = true;
        },
        saveItem(){
            if (!this.formItem.name) {$dialog.alert('请先填写名称', '操作失败') ;return};
            if (!this.formItem.unit) {$dialog.alert('请先填写单位', '操作失败') ;return};
            if (!this.formItem.targetValue) {$dialog.alert('请先填写目标值', '操作失败') ;return};
            if (this.formItem.index || this.formItem.index == 0){
                this.items[this.formItem.index]=(Object.assign({},this.formItem));
            } else {
                this.items.push(Object.assign({},this.formItem));
            }
            this.formItem = {};
            this.dateDialog = false;
        },
        updateUnit(index) {
            this.formItem = Object.assign({},this.items[index]);
            this.formItem.index = index;
            this.$forceUpdate();
            this.dateDialog = true;
        },
        updateScore(index) {
            this.formItem = Object.assign({},this.items[index]);
            this.formItem.index = index;
            this.$forceUpdate();
            this.dateDialog = true;
        },
        cancel() {
            this.$emit('cancel');
        },
        submit() {
            let datas = this.items;
            let itemNames = [];

            for (let i in datas){
                if (!datas[i].name || !datas[i].unit){
                    $dialog.alert('请先填写完整数据项', '操作失败');
                    return;
                }
                if (itemNames.indexOf(datas[i].name) != -1 ){
                    $dialog.alert('数据项名称不能重复', '操作失败');
                    return;
                }else {
                    itemNames.push(datas[i].name)
                }
            }
            this.$emit('submit', this.items);
        },
    }
}
</script>

