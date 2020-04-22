<template>
    <f7-page class="add_client_page">
        <f7-navbar :title="pageTitle" back-link>
            <!--<f7-nav-right v-if="stage_new || stage_edit">-->
                <!--<f7-link href="#" @click="cancel">取消</f7-link>-->
                <!--<f7-link href="#" @click="save">保存</f7-link>-->
            <!--</f7-nav-right>-->
            <f7-nav-right v-if="!editModel">
                <f7-link href="#" @click="setEditModel">编辑</f7-link>
            </f7-nav-right>
            <f7-nav-right v-if="editModel">
                <f7-link href="#" @click="cancel">取消</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="content_layer">
            <div class="content">
                <f7-block-title>{{classify}}</f7-block-title>
                <f7-list>
                    <f7-list-item>
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">创建人</span>
                        <span>{{client.manager && this.who(client.manager).name}}</span>
                    </f7-list-item>

                    <f7-list-item v-if="reference && reference.serial">
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户编号':reference == null?'商家编号':reference.classify == '客户资料'?'客户编号':'商家编号'}}</span>
                        <!-- <div class="hawk-input-label" >
                         </div>-->

                        <!--<div  style="font-size: 17px" >
                            {{classify == '客户资料' || reference.classify == '客户资料'?client.number='K'+(new Date()).getTime():
                            classify == '查看客户' || reference.classify == '查看客户'?client.number: client.number='S'+(new Date()).getTime()}}
                        </div>-->


                        <input
                                slot="inner" style="text-align:right; width:70%; height: inherit;"
                                type="text"
                                :placeholder="namePlaceholder"
                                :value="reference.serial || ''"
                                readonly
                        >
                    </f7-list-item>
                    <f7-list-item>
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户名称':reference == null?'商家名称':reference.classify == '客户资料'?'客户名称':'商家名称'}}</span>
                        <input
                                slot="inner" style="text-align:right; width: calc(100% - 90px); height: inherit;"
                                type="text" :placeholder="namePlaceholder"
                                :value="client.name || ''"
                                @input="client.name = $event.target.value"
                        >
                    </f7-list-item>

                    <f7-list-item :after="(client.private?'我的（私有）':'部门（部门公有）')" :link="(editModel?'#':false)" ref="picker_private"
                                  @click="selectPicker('private', client.private, ['true', 'false'], ['我的（私有）','部门（部门公有）'])">
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户归属':reference == null?'商家归属':reference.classify == '客户资料'?'客户归属':'商家归属'}}</span>
                    </f7-list-item>

                    <f7-list-item :after="client.type" :link="(editModel?'#':false)" ref="picker_type"
                                  @click="selectPicker('type', client.type, myCompany.clientType)">
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户类型':reference == null?'商家类型':reference.classify == '客户资料'?'客户类型':'商家类型'}}</span>
                    </f7-list-item>

                    <f7-list-item :after="client.grade" :link="(editModel?'#':false)" ref="picker_grade"
                                  @click="selectPicker('grade', client.grade, myCompany.clientGrade)">
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户等级':reference == null?'商家等级':reference.classify == '客户资料'?'客户等级':'商家等级'}}</span>
                    </f7-list-item>

                    <f7-list-item :after="regionTitle" :link="(editModel?'#':false)" ref="picker_region"
                                  @click="selectPicker('region', client.region, cRegionsId, cRegions)">
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户区域':reference == null?'商家区域':reference.classify == '客户资料'?'客户区域':'商家区域'}}</span>
                    </f7-list-item>

                    <f7-list-item :after="client.intention" :link="(editModel?'#':false)" ref="picker_intention"
                                  @click="selectPicker('intention', client.intention,myCompany.intentionType)">
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户意向':reference == null?'商家意向':reference.classify == '客户资料'?'客户意向':'商家意向'}}</span>
                    </f7-list-item>

                    <f7-list-item
                            :after="client.location && client.location.name || '请选择'"
                            :link="(editModel?'#':false)"
                            @click="$f7.popup.open('#client-location-selector')"
                    >
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">拜访地址</span>
                    </f7-list-item>

                    <f7-list-item>
                        <span v-if="editModel" slot="title" style="color:red">* </span>
                        <span slot="title">{{classify == '客户资料'?'客户地址':reference == null?'商家地址':reference.classify == '客户资料'?'客户地址':'商家地址'}}</span>
                        <input
                                slot="inner" style="text-align:right; width: calc(100% - 90px); height: inherit;"
                                :value="client.location && client.location.text || ''"
                                @input="client.location.text = $event.target.value"
                                type="text" placeholder="请填写地址信息"
                        >
                    </f7-list-item>

                    <f7-list-item class="input-photo" title="照片">
                        <photoeditor
                                slot="inner"
                                :gallery="true"
                                :photos="client.photo"
                                @photo:update="(photos) => {client.photo = photos}"
                        ></photoeditor>
                    </f7-list-item>

                    <f7-list-item class="input-textarea" title="备注">
                <textarea
                        slot="after-title"
                        placeholder="请填写客户备注"
                        :value="client.notes"
                        @input="client.notes = $event.target.value"
                ></textarea>
                    </f7-list-item>

                    <f7-list-item divider></f7-list-item>

                    <f7-list-item
                            v-if="!editModel"
                            title="客户联系人"
                    >
                    </f7-list-item>
                    <f7-list-item v-if="editModel">
                        <span slot="title" style="color:red">* </span>
                        <span slot="title">客户联系人</span>
                        <span slot="after" @click="newContact">新建联系人</span>
                    </f7-list-item>

                    <div class="contacts_item" v-for="(cont, i) in client.contacts" :key="i">
                        <div v-if="editModel && superAdmin._id == myProfile._id" @click="contacts_remove(i)">
                            <img class="bt_remove" src="../../assets/images/btn_minus_red@2x.png">
                        </div>
                        <div @click="editContact(i)">
                            <div>
                                {{cont.name}} <span style="font-size: 12px;color: #666666">主联系人</span>
                            </div>
                            <div>
                                手机: {{cont.phone || '无'}}
                                <img style="height: 12px" src='../../assets/images/arrow_right_gray copy 2@2x.png'>
                            </div>
                        </div>
                    </div>

                </f7-list>

                <div v-if="editModel && reference && superAdmin._id == myProfile._id" class="bt_delete">
                    <div @click="remove">删除该客户</div>
                </div>
            </div>
            <div v-if="editModel" class="bt_save">
                <div @click="save">保存</div>
            </div>
        </div>

        <!--<f7-popup id="client-personnelselector">-->
        <!--<personnelselector :multiple="false" @submit="selectEmployee" @cancel="$f7.popup.close('#client-personnelselector')"></personnelselector>-->
        <!--</f7-popup>-->

        <f7-popup id="client-location-selector" @popup:opened="$refs.location.init()">
            <location @selected="getLocation" @cancel="$f7.popup.close('#client-location-selector')"
                      ref="location"></location>
        </f7-popup>

        <f7-popup id="client-contact">
            <contact :contacts="client.contacts" :readonly="!editModel" ref="contacteditor" @contact:done="closeContactEditor"></contact>
        </f7-popup>

    </f7-page>
</template>
<style scoped>
    .contacts_item {
        height: 44px;
        line-height: 44px;
        background-color: white;
        color: #333333;
        overflow: hidden;
    }
    .contacts_item>div:first-child{
        float: left;
        padding: 0px 10px;
        width: 19px;
        text-align: right;
    }
    .contacts_item>div:last-child{
        float: right;
        width: calc(100% - 40px);
    }
    .contacts_item>div>div:first-child{
        text-align: left;
        float: left;
        /*width: calc(50% - 12px);*/
    }
    .contacts_item>div>div:last-child{
        padding-right: 12px;
        text-align: right;
        float: right;
        /*width: calc(50% - 12px);*/
    }
    .bt_save{
        height: 45px;
        width: 100%;

    }
    .bt_save>div{
        width: 100%;
        height: 45px;
        background-color: #01b38b;
        font-size: 16px;
        color: white;
        text-align: center;
        line-height: 45px;
    }
    .content_layer {
        position: relative;
        height: 100%;
        overflow: hidden;
    }
    .content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        height: calc(100% - 45px);
        position: relative;
        z-index: 1;
    }
    .bt_delete{
        height: 45px;
        width: 100%;
    }
    .bt_delete>div{
        z-index: 1;
        width: 100%;
        height: 45px;
        background-color: white;
        font-size: 16px;
        color: #FF715A;
        text-align: center;
        line-height: 45px;
        margin: 10px 0px;
    }
    .bt_remove{
        width: 19px;
        margin-bottom: -3px;
        margin-right: 4px;
    }
</style>
<style>
    .add_client_page .page-content {
        overflow: hidden;
    }
</style>

<script>
    import {defaultImgUrl} from 'lib/loading';
    import {mapGetters, mapActions} from 'vuex';
    import personnelselector from 'gadget/personnelselector.vue';
    import location from 'gadget/location.vue';
    import photoeditor from 'gadget/photoeditor.vue';
    import contact from './contact.vue';
    import axios from 'axios';

    export default {
        components: {
            personnelselector,
            location,
            photoeditor,
            contact
        },

        props: [
            'lastPage',
            'reference',
            'classify',
            'ocr'
        ],

        data() {
            return {
                pickers:{},//临时存放状态
                editModel: false,
                namePlaceholder:"",
                client: {
                    name: '',
                    type: '',
                    grade: '',
                    region: '',
                    intention: '',
                    // manager: null, // 已弃用
                    photo: [],
                    notes: '',
                    manager: null,
                    department: null,
                    private: true,
                    classify: null,
                    contacts: [],
                    location: {}
                }
            }
        },

        computed: {
            ...mapGetters([
                'myCompany',
                'who',
                'myProfile',
                'companyRegions',
                'userDepartment',
                'regionName',
                'superAdmin',
                'organization'
            ]),
            pageTitle() {
                if (this.stage('edit')) return this.reference.classify == '客户资料'? '编辑客户':'编辑商家';
                if (this.stage('new')) return this.classify == '客户资料' ? '新增客户':'新增商家';
                return '查看客户';
            },
            cRegions(){
                let arr = []
                this.companyRegions.forEach(item=>arr.push(item.name))
                return arr
            },
            cRegionsId(){
                let arr = []
                this.companyRegions.forEach(item=>arr.push(item.id))
                return arr
            },
            regionTitle(){
                let arr = this.companyRegions.filter(item=>this.client.region==item.id)
                console.log(arr)
                return arr.length?arr[0].name:""
            },
            stage_new() {
                return this.stage('new')
            },
            stage_edit() {
                return this.stage('edit')
            },
            stage_readonly() {
                return this.stage('readonly')
            }
        },

        mounted() {
            if (this.reference) {
                this.client = this.reference;

                // set default value for smart select (I know it's ugly)
                // if (this.client.type) this.$refs.item_type.f7SmartSelect.setValue(this.client.type);
                // if (this.client.grade) this.$refs.item_grade.f7SmartSelect.setValue(this.client.grade);
                // if (this.client.region) this.$refs.item_region.f7SmartSelect.setValue(this.regionName(this.client.region));
                // if (this.client.intention) this.$refs.item_intention.f7SmartSelect.setValue(this.client.intention);
                // if (this.client.private) this.$refs.item_private.f7SmartSelect.setValue(this.client.private);

            } else {

                this.client.type = this.myCompany.clientType && this.myCompany.clientType[0] || '';
                this.client.grade = this.myCompany.clientGrade && this.myCompany.clientGrade[0] || '';
                this.client.region = "0";
                this.client.classify = this.classify // 添加所属用户
                this.client.intention = this.myCompany.intentionType && this.myCompany.intentionType[0] || '';
                this.client.manager = this.myProfile._id // 添加所属用户
                this.client.department = this.userDepartment(this.myProfile._id) && this.userDepartment(this.myProfile._id).departmentId || this.organization.departmentId // 添加所属用户

                this.namePlaceholder = this.classify == '客户资料'?'请填写客户名称':'请填写商家名称';
            }
            this.initOCR()
            if (!this.client.location) this.client.location = {};

            this.$forceUpdate();
        },

        methods: {
            initOCR(){
                if(!this.ocr)return
                if(!this.client.name && this.ocr.company.length){
                    this.client.name = this.ocr.company[0]
                }
                if(!this.client.location.text && this.ocr.addr.length){
                    this.client.location.text = this.ocr.addr[0]
                }
                if(this.ocr.photo){
                    this.client.photo.push(this.ocr.photo)
                }

                // 打开新建联系人
                this.newContact()
            },
            stage(expected) {
                let status = 'readonly';

                if (!this.client._id) {
                    status = 'new';
                    this.editModel = true
                }

                // if (this.client._id && ['admin', 'manager'].includes(this.myProfile.role)){
                if (this.client._id && this.client.manager == this.myProfile._id) {
                    status = 'edit';
                }

                return expected == status;
            },

            // selectEmployee(pList) {
            //     if (pList && pList[0]) {
            //         this.client.manager = pList[0];
            //     } else {
            //         this.client.manager = null;
            //     }
            //     this.$forceUpdate();
            //     $f7.popup.close('#client-personnelselector')
            // },
            setEditModel(){
                console.log(this.editModel)
                this.editModel = true
                this.$forceUpdate()
            },
            getLocation(loc) {
                if (loc && loc.address) {
                    let {lng, lat, address, name} = loc;
                    let text = ''
                    if (this.client.location){
                        text = this.client.location.text
                    } else {
                        this.client.location = {};
                    }
                    this.client.location.lng = lng;
                    this.client.location.lat = lat;
                    this.client.location.name = name;
                    this.client.location.address = address;
                    this.client.location.text = text;
                }
                this.$forceUpdate();
                $f7.popup.close('#client-location-selector');
            },

            newContact() {
                this.$refs.contacteditor.init(null,this.ocr);
                $f7.popup.open('#client-contact');
            },

            editContact(index) {
                this.$refs.contacteditor.init(index);
                $f7.popup.open('#client-contact');
            },

            closeContactEditor() {
                $f7.popup.close('#client-contact');
                this.$forceUpdate();
            },
            cancelContactEditor() {
                $f7.popup.close('#client-contact');
                this.$forceUpdate();
            },

            cancel() {
                this.$f7router.back();
            },
            selectPicker(key, value, values, displayValues) {
                if(!this.editModel)return

                if (this.pickers[key]) {
                    this.pickers[key].open();
                    return;
                }
                this.pickers[key] = this.$f7.picker.create({
                    inputEl: '#picker_' + key,
                    toolbarCloseText: '完成',
                    cols: [
                        {
                            textAlign: 'center',
                            values: values || [],
                            displayValues: displayValues || values || [],
                        }
                    ],
                    on: {
                        change: (picker, values, displayValues) => {
                            if (values && values.length) {
                                if(values[0]=='true'){
                                    this.client[key] = true
                                } else if(values[0]=='false'){
                                    this.client[key] = false
                                } else {
                                    this.client[key] = values[0]
                                }
                                this.$forceUpdate();
                            }
                        }
                    }
                });
                this.pickers[key].setValue([value])
                this.pickers[key].open();
            },
            save () {
                let etype = this.classify == '客户资料' ? '客户' : '商家';
                let errors = {
                    name: etype + '名称不能为空',
                    type: etype + '类型不能为空',
                    grade: etype + '等级不能为空',
                    region: etype + '区域不能为空',
                    intention: etype + '意向不能为空',
                }, error_msg = '';

                Object.keys(errors).forEach(k => {
                    if (!this.client[k]) error_msg = errors[k];
                });

                if (error_msg) {
                    $alert(error_msg, '操作错误');
                    return;
                }

                if (!this.client.location.name){

                    $alert("地址不能为空", '操作错误');
                    return;
                }

                if (this.client.contacts.length == 0){

                    $alert("联系人不能为空", '操作错误');
                    return;
                }

                if (this.client._id) {
                    this.confirmSave(etype)
                } else {
                    let self = this;
                    let filter = {
                        name: this.client.name
                    }
                    $preloader.show();
                    axios.get('api/client?q=' + JSON.stringify(filter)).then(resp => {
                        $preloader.hide();
                        if (resp.data.length) {
                            $confirm('贵公司已存在该客户/商家，是否要继续添加', '操作确认', () => {
                                self.confirmSave(etype)
                            })
                        } else {
                            self.confirmSave(etype)
                        }
                    }).catch(err => {
                        $preloader.hide();
                        console.error(err);
                        $alert('无法更新数据，请稍后再试', '操作错误');
                    })
                }
            },
            confirmSave(etype) {
                let sync = this.client._id ? axios.put : axios.post;
                let path = 'api/client' + (this.client._id ? `/${this.client._id}` : '');
                let self = this;
                $preloader.show();
                sync(path, this.client).then(resp => {
                    $preloader.hide();
                    $alert(etype + '资料已经保存', '操作成功', () => {
                        self.$f7router.back();
                    })
                    this.editModel = false
                }).catch(err => {
                    $preloader.hide();
                    console.error(err);
                    $alert('无法保存数据，请稍后再试', '操作错误');
                });
            },

            remove() {
                if (!this.client._id) return;
                let etype = this.classify == '客户资料' ? '客户' : '商家';
                $confirm('确定要删除该客'+ etype +'吗？', '操作确认', () => {
                    $preloader.show();
                    axios.delete(`api/client/${this.client._id}`).then(resp => {
                        $preloader.hide();
                        this.$f7router.back();
                    }).catch(err => {
                        $preloader.hide();
                        $alert('数据更新出错，请稍后再试', '操作错误');
                    })
                });
            },
            contacts_remove(index){
                if (index >= 0) this.client.contacts.splice(index, 1);
                this.$forceUpdate()
            }
        }
    }
</script>
