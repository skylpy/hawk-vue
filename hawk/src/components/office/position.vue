<template>
    <f7-page>
        <f7-navbar title="实时查岗" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="$f7.popup.open('#position-personnelselector')">选择员工</f7-link>
                <f7-link href="#" @click="$f7.popup.open('#position-details')">统计</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="map">
            <div id="position-amap-container" :style="amap.style"></div>

            <div class="map-input">
                <f7-button round outline icon-fa="refresh" @click="loadPosition">
                    <span> 刷新</span>
                </f7-button>
            </div>
        </div>

        <f7-popup id="position-personnelselector">
            <personnelselector
                :multiple="true"
                :subordinate="true"
                :selectedList="employees"
                :isFilterSub="true"
                @submit="selectEmployee"
                @cancel="$f7.popup.close('#position-personnelselector')"
            ></personnelselector>
        </f7-popup>

        <f7-popup id="position-details">
            <f7-page>
                <f7-navbar title="定位统计">
                    <f7-nav-right>
                        <f7-link @click="$f7.popup.close('#position-details')">确定</f7-link>
                    </f7-nav-right>
                </f7-navbar>

                <f7-block-title>定位信息列表</f7-block-title>
                <f7-list>
                    <f7-list-item
                        v-for="(uId, index) in employees"
                        :key="index"
                        :title="who(uId).name"
                        link="#"
                        @click="show(uId)"
                    >
                        <div slot="after-title" style="width:80%; max-width:80%">
                            <div>{{getPosItem(uId).address || '没有数据'}}</div>

                            <div v-if="getPosItem(uId).locatetime" style="font-size:small; color:gray">

                                {{ (new Date(getPosItem(uId).locatetime)).toMinutesString() }}

                                <span style="font-size: smaller; color:red">
                                    ({{(Math.floor((Date.now() - (new Date(getPosItem(uId).locatetime)).getTime()) / 60000))}}分钟之前)
                                </span>
                            </div>
                        </div>
                    </f7-list-item>
                </f7-list>

            </f7-page>
        </f7-popup>

    </f7-page>
</template>

<style scoped>
.map {
    position: relative;
}
.map-input {
    position: absolute;
    bottom: 50px;
    margin-left: 30px;
}
</style>

<script>
import {defaultImgUrl} from 'lib/loading';
import {mapGetters, mapActions} from 'vuex';
import personnelselector from 'gadget/personnelselector.vue';
import {createMap, addMarker, getVisibleHeight, getAddress} from 'lib/amap';
import axios from 'axios';

export default {
    components: {
        personnelselector
    },

    props: [
        'lastPage'
    ],

    data() {
        return {
            amap: {
                instance: null,
                style: {
                    width: '100%',
                    height: '100px'
                },
                markers: []
            },

            employees: [],
            positions: []
        }
    },

    watch: {
        employees: function(value, oldvalue) {
            this.loadPosition();
        },
        positions: function(value, oldvalue) {
            if (!this.amap.instance || this.positions.length < 1) return;

            this.amap.markers.forEach(m => {
                this.amap.instance.remove(m);
            });

            this.positions.forEach(pos => {
                this.displayPosition(pos);
            });
        }
    },

    computed: {
        ...mapGetters([
            'myUserId',
            'who'
        ])
    },

    mounted() {
        this.loadMap();

        if (this.employees.length == 0) {
            this.employees = [this.myUserId];
        }
    },

    methods: {
        getPosItem(uid) {
            let pos = {};
            this.positions.forEach(async position => {
                if (position.name == this.who(uid).name) {
                    pos = position;
                    if (!pos.address) {
                        pos.address = await getAddress(position.location.split(',')[0], position.location.split(',')[1]);
                        this.$forceUpdate()
                    }
                }
            })
            return pos;
        },

        selectEmployee(pList) {
            if (pList) this.employees = pList;
            $popup.close('#position-personnelselector');
        },

        loadMap() {
            this.amap.style.height = getVisibleHeight() + 'px';
            this.amap.instance = createMap('position-amap-container', {zoom: 'rb'});
        },

        show(uId) {
            if (!uId) return;
            this.employees = [uId];
            $popup.close('#position-details');
        },

        displayPosition(pos) {
            let current_pos = [
                parseFloat(pos.location.split(',')[0]),
                parseFloat(pos.location.split(',')[1])
            ];

            let marker = new AMap.Marker({
                iconTheme: 'fresh',
                iconStyle: 'black',
                map: this.amap.instance,
                position: current_pos,
                label: {
                    content: pos.name,
                    offset: new AMap.Pixel(27, 25)
                }
            });
            if (this.amap.instance.setCenter && marker.getPosition){
                this.amap.instance.setCenter(marker.getPosition());
            }
            this.amap.markers.push(marker);
        },

        loadPosition() {
            $preloader.show();
            axios.get('api/trace/current?q=' + JSON.stringify({userIds: this.employees})).then(resp => {
                this.positions = resp.data;
                console.log(resp.data)
                $preloader.hide();
            }).catch(err => {
                console.error(err);
                $preloader.hide();
                $alert('无法更新位置信息，请稍后再试', '操作错误');
            })
        }
    }
}
</script>

