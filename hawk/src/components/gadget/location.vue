<template>
    <f7-page class="location-page">
        <f7-navbar class="location-page-nav" title="选择地点">
            <f7-nav-right>
                <f7-link @click="$emit('cancel')">取消</f7-link>
                <f7-link @click="$emit('selected', location)">确定</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="map">
            <div id="location-amap-container" :style="amap.style"></div>
            <div class="map-input">
                <input id="location-pickerInput" placeholder="输入关键字选取地点" />
            </div>
        </div>

    </f7-page>
</template>

<style scoped>
.map {
    position: relative;
}
.map-input {
    position: absolute;
    top: 0;
    width: 100%;
}
#location-pickerInput {
    width: 90%;
    margin-top: 20px;
    margin-left: 5%;
    padding: 10px;
    text-decoration: none;
    outline: 0;
    display: block;
    color: #6a6f77;
    border: 1px solid #c8cccf;
    border-radius: 4px;
    height: 2.7em;
    font-size: 1.4em;
    box-sizing: border-box;
}
</style>

<script>
import {createMap, destroyMap} from 'lib/amap';

export default {
    data() {
        return {
            amap: {
                instance: null,
                style: {
                    width: '100%',
                    height: '100px'
                }
            },

            location: {}
        }
    },

    methods: {
        getLocation(poi) {
            this.location = {
                name: poi.item.name,
                id: poi.item.id,
                address: poi.item.address,
                district: poi.item.district,
                lng: poi.item.location.lng,
                lat: poi.item.location.lat,
            }
            $('#location-pickerInput').val(this.location.name);
        },
        initMarker(){
            if (!this.amap.instance) return
            // 点击添加标注功能
            let marker
            let geocoder
            AMap.plugin('AMap.Geocoder', ()=>{
                geocoder = new AMap.Geocoder()
            })
            let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -34)
            });
            this.amap.instance.on('click',(e)=>{
                if(geocoder){
                    this.amap.instance.clearMap();
                    marker = new AMap.Marker({position: e.lnglat});
                    let poi = geocoder.getAddress(e.lnglat,(status,result)=>{
                        if(status=='complete'&& result.info=="OK"){
                            let r = result.regeocode
                            let a = result.regeocode.addressComponent
                            this.location = {
                                name: a.township+a.street+a.streetNumber,
                                id: a.adcode,
                                address: a.township+a.street+a.streetNumber,
                                district: a.province+a.city+a.district,
                                lng: e.lnglat.getLng(),
                                lat: e.lnglat.getLat(),
                            }
                            $('#location-pickerInput').val(this.location.name);
                            infoWindow.setContent('<pre>' + r.formattedAddress + '</pre>');
                            infoWindow.open(this.amap.instance, e.lnglat);
                            this.amap.instance.add(infoWindow);
                        }
                    })
                    this.amap.instance.add(marker);

                }
            })

        },
        init() {
            if (!this.amap.instance) {
                let navHeight = document.querySelector('.location-page-nav').clientHeight;

                if (navHeight) {
                    let windowHeight = window.outerHeight > 0 ? window.outerHeight : window.innerHeight;
                    this.amap.style.height = (windowHeight - navHeight) + 'px';

                    this.amap.instance = createMap('location-amap-container', {
                        poiPickerInputId: "location-pickerInput",
                        poiPickerCallBack: this.getLocation,
                        zoom: 'rb'
                    });
                }
                this.initMarker();
            }
        }
    },

    mounted() {
        this.init();
    },
}
</script>

