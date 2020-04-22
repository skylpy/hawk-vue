const mapTools = {

};

function loadMap() {
    return new Promise((resolve, reject) => {
        let t = setInterval(() => {
            if (typeof(AMap) == 'undefined' || typeof(AMapUI) == 'undefined') return;

            if (AMap && AMapUI) {
                clearInterval(t);
                console.log('AMap and AMapUI is on duty');
                resolve();
            }
        }, 1000);
    }).then(() => {
        let basicControlLoader = new Promise((resolve, reject) => {
            if (!mapTools.BasicControl) {
                AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
                    console.log("amap [control/BasicControl] is loaded");
                    mapTools.BasicControl = BasicControl;
                    resolve();
                });
            } else {
                resolve();
            }
        });

        let poiPickerLoader = new Promise((resolve, reject) => {
            if (!mapTools.PoiPicker) {
                AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
                    console.log("amap [misc/PoiPicker] is loaded");
                    mapTools.PoiPicker = PoiPicker;
                    resolve();
                });
            } else {
                resolve();
            }
        });

        let pathSimplifierLoader = new Promise((resolve, reject) => {
            if (!mapTools.PathSimplifier) {
                AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
                    console.log("amap [ui/misc/PathSimplifier] is loaded");
                    mapTools.PathSimplifier = PathSimplifier;
                    resolve();
                });
            } else {
                resolve();
            }
        });

        let simpleInfoWindowLoader = new Promise((resolve, reject) => {
            if (!mapTools.SimpleInfoWindow) {
                AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
                    console.log("amap [overlay/SimpleInfoWindow] is loaded");
                    mapTools.SimpleInfoWindow = SimpleInfoWindow;
                    resolve();
                });
            } else {
                resolve();
            }
        });


        return Promise.all([basicControlLoader, poiPickerLoader, pathSimplifierLoader, simpleInfoWindowLoader]);
    })
}

function createMap(container, opt) {
    if (typeof AMap == 'undefined' || typeof AMapUI == 'undefined') {
        console.error("AMap or AMapUI is not found");
        return null;
    }

    let options = opt || {};
    let instance = new AMap.Map(container, {
        zoom:13,//级别
        center: options.coordinates,//中心点坐标
        viewMode:'2D'//使用3D视图
    });


    let {BasicControl, PoiPicker, PathSimplifier} = mapTools;

    if (options.zoom) {
        //缩放控件
        instance.addControl(new BasicControl.Zoom({
            position: options.zoom,
            showZoomNum: false //显示zoom值
        }));
    }

    if (options.poiPickerInputId) {
        var poiPicker = new PoiPicker({ input: options.poiPickerInputId });

        var marker = new AMap.Marker();
        var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -20)
        });

        //选取了某个POI
        poiPicker.on('poiPicked', function(poiResult) {

            const none = 'GPS信号弱，正在确认地址信息'
            var source = poiResult.source,
                poi = poiResult.item,
                info = {
                    source: source,
                    id: poi.id,
                    name: poi.name,
                    location: poi.location.toString(),
                    address: poi.address||none
                };

            marker.setMap(instance);
            infoWindow.setMap(instance);

            marker.setPosition(poi.location);
            infoWindow.setPosition(poi.location);
            infoWindow.setContent('<pre>' + poi.address||none + '<br>' + poi.name + '</pre>');
            infoWindow.open(instance, marker.getPosition());
            if (instance.setCenter && marker.getPosition) {
              instance.setCenter(marker.getPosition());
            }

            if (options.poiPickerCallBack) {
                (options.poiPickerCallBack)(poiResult);
            }
        });
    }

    return instance;
}

function destroyMap(map) {
    if (map) {
        map.destroy();
    }
}

function addMarker(map, position, address) {
    let marker = new AMap.Marker();
    marker.setMap(map);
    marker.setPosition(position);

    let infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20)
    });

    if(address){
      infoWindow.setMap(map);
      infoWindow.setContent('<pre>' + address + '</pre>');
      infoWindow.open(map, marker.getPosition());
    }

    if (map.setCenter && marker.getPosition) {
      map.setCenter(marker.getPosition());
    }
    return {marker, infoWindow};
}

function addMarkers(map, data) {
  //初始化地图对象，加载地图
  let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
  data.forEach(v => {
    let marker = new AMap.Marker({
      position: [v.lng, v.lat],
      map: map
    });
    marker.content = v.content;
    marker.on('click', markerClick);
    marker.emit('click', {target: marker});
  })
  function markerClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
  }
  map.setFitView();
}

function addGeoLocation(map, cb, error_cb) {
    AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'LB',

          showMarker: false,
          showCircle: false,
          panToLocation: false
        });

        map.addControl(geolocation);

        AMap.event.addListener(geolocation, 'complete', cb);
        AMap.event.addListener(geolocation, 'error', error_cb);

        geolocation.getCurrentPosition();
      })
}

function drawPath(map) {

    let PathSimplifier = mapTools.PathSimplifier;

    if (!PathSimplifier){
        console.error("amap drawPath fails: PathSimplifier not found");
        return;
    }

    //just some colors
    var colors = [
        "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
        "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
        "#651067", "#329262", "#5574a6", "#3b3eac"
    ];

    var pathSimplifierIns = new PathSimplifier({
        zIndex: 100,
        //autoSetFitView:false,
        map: map, //所属的地图实例

        getPath: function(pathData, pathIndex) {
            return pathData.path;
        },
        getHoverTitle: function(pathData, pathIndex, pointIndex) {
            if (pointIndex >= 0) {
                //point
                return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
            }
            return pathData.name + '，点数量' + pathData.path.length;
        },
        renderOptions: {
            keyPointStyle: {
                radius: 20
            },
            pathLineStyle: {
                dirArrowStyle: true
            },
            getPathStyle: function(pathItem, zoom) {
                var color = colors[pathItem.pathIndex % colors.length],
                    lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));

                return {
                    pathLineStyle: {
                        strokeStyle: color,
                        lineWidth: lineWidth
                    },
                    pathLineSelectedStyle: {
                        lineWidth: lineWidth + 2
                    },
                    pathNavigatorStyle: {
                        fillStyle: color
                    }
                };
            }
        }
    });

    return pathSimplifierIns;
}

function getDistBetween(a, b) {
    return AMap.GeometryUtil.distance(a, b);
}

function getVisibleHeight() {
    let navHeight = document.querySelector('.navbar').clientHeight;
    let windowHeight = window.outerHeight > 0 ? window.outerHeight : window.innerHeight; // iOS return 0 for window.outerHeight
    let visibleHeight = windowHeight - navHeight;

    window.visibleHeight = visibleHeight;
    return visibleHeight;
};

function showInfo(map, params) {
    let SimpleInfoWindow = mapTools.SimpleInfoWindow;

    var infoWindow = new SimpleInfoWindow({
        infoTitle: '<strong><%- title %></strong>',
        infoBody: '<p>' + params.content + '</p>',
        infoTplData: params
    });

    //显示在map上
    infoWindow.open(map, params.center);
}

function getAddress(lng,lat){
  return new Promise( function(resolve, reject) {
    let geocoder
    AMap.plugin('AMap.Geocoder', ()=>{
      geocoder = new AMap.Geocoder();
    })
    if(geocoder){
      let poi = geocoder.getAddress([lng,lat],(status,result)=>{
        if(status=='complete'&& result.info=="OK"){
          let r = result.regeocode
          let a = result.regeocode.addressComponent
          // this.location = {
          //   name: a.township+a.street+a.streetNumber,
          //   id: a.adcode,
          //   address: a.township+a.street+a.streetNumber,
          //   district: a.province+a.city+a.district,
          //   lng: lng,
          //   lat: lat,
          // }
          resolve(r.formattedAddress);
        }else{
          reject('获取失败');
        }
      });
    }
  });
}
export {
    loadMap,
    createMap,
    destroyMap,
    addGeoLocation,
    addMarker,
    drawPath,
    getDistBetween,
    getVisibleHeight,
    showInfo,
    getAddress,
    addMarkers
};
