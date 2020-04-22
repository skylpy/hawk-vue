<template>
  <f7-page :page-content="false">
    <f7-navbar title="测试页面" back-link back-link-url="\"></f7-navbar>
    <f7-toolbar tabbar>
      <f7-link tab-link="#tab-1" tab-link-active>device</f7-link>
      <f7-link tab-link="#tab-2">camera</f7-link>
      <f7-link tab-link="#tab-3">location</f7-link>
    </f7-toolbar>

    <f7-tabs animated>
      <f7-tab id="tab-1" class="page-content" tab-active>

        <f7-card
          outline
          title = "Device Information">
          <f7-card-content>
            <div>
              <ul>
                <li v-for="(val, key) in getDeviceInfo()" :key="key">
                  Device.{{key}} = {{val}}
                </li>
              </ul>
            </div>

          </f7-card-content>
        </f7-card>

        <f7-card
          outline
          title = "Android Fingerprint">
          <f7-card-content>
            <div style="word-wrap: break-word">
              <ul>
                <li v-for="(val, key) in fingerprint" :key="key">
                  {{key}} = {{val}}
                </li>
              </ul>
            </div>
          </f7-card-content>
        </f7-card>
      </f7-tab>

      <!-- camera test -->
      <f7-tab id="tab-2" class="page-content">
        <f7-block-title> Camera Test</f7-block-title>
        <f7-block>
          <f7-list>
            <f7-list-button title="拍摄头像" @click="snap"></f7-list-button>
            <img :src="photoUrl" width="60" />
          </f7-list>

        </f7-block>
      </f7-tab>

      <!-- amap location test -->
      <f7-tab id="tab-3" class="page-content">
        <f7-block-title> Location Test </f7-block-title>
        <f7-block>
          <div>
            ****** {{JSON.stringify(this.currPositon)}}
          </div>
          <div>
            <ul>
              <li>
                status = {{position.status}}
              </li>
              <li v-for="(val, key) in position.details" :key="key">
                  {{key}} = {{val}}
                </li>
            </ul>
          </div>
        </f7-block>
        <f7-list>
          <f7-list-button :style="{disabled: (position.status == 'loading')}" @click="getLocation" title="refresh"></f7-list-button>
        </f7-list>
      </f7-tab>

    </f7-tabs>
  </f7-page>
</template>

<script>
/*
packageName  = com.sanfanerp.hawk
debug.SHA1   = BD:0F:77:5F:3B:1A:1F:63:DB:0D:D5:41:15:69:69:86:D0:7A:9E:E5
release.SHA1 = BD:BC:7B:B3:92:05:83:A6:78:72:45:6A:69:B5:01:CE:08:22:EC:56
*/
import {openCamera} from 'lib/camera';
import {defaultImgUrl} from 'lib/loading';

import {mapGetters} from 'vuex';

export default {

  data: () => {
    return {
      amap: null,
      photoUrl: defaultImgUrl,
      fingerprint: {
        SHA1: '-- unavaliable -- ',
        packageName: '-- unavaliable -- '
      },
      position: {
        status: '-- unavaliable -- ',
        details: {}
      }
    }
  },

  mounted: function() {
    
    if (this.getDeviceInfo().platform && this.getDeviceInfo().platform.toLowerCase() == 'android') {
      this.getAndroidFingerprint();
    }

    this.getLocation();
  },

  computed: {
    ...mapGetters({
      'currPositon' : 'position'
    })
  },

  methods: {
    snap() {
      openCamera((ret) => {
        console.debug('openCamera() returns ', ret);

        if (ret instanceof Error) {
          this.photoUrl = '#';
        } else {
          this.photoUrl = ret;
        }
      });
    },

    getLocation() {

      if (!AMapLocation) {
        this.position.status = '-- unavaliable -- ';
        return;
      }

      this.position.status = 'loading';

      AMapLocation.getCurrentPosition(null, (resp) => {
        this.position.status = 'updated';
        this.position.details = resp;
        console.info('refreshing my position as', resp);

        if (this.amap.setCenter && resp.longitude && resp.latitude) {
          this.amap.setCenter([resp.longitude, resp.latitude]);
        }

      }, (err) => {
        this.position.status = 'error';
        console.error('fails to get current position through amap');
        console.error(err);
      })
    },

    getDeviceInfo() {
      let info = {};
      ['cordova', 'model', 'platform', 'uuid', 'version', 'manufacturer', 'isVirtual', 'serial'].forEach((item) => {
        info[item] = device[item];
      });

      return info;
    },

    getAndroidFingerprint() {
      cordova.getSignatureFingerprint.getSignature((sha1) => {
        this.fingerprint.SHA1 = sha1;
      }, (err) => {
        this.fingerprint.SHA1 = '(Error)' + err.message;
      });

      cordova.getSignatureFingerprint.getPackageName((name) => {
        this.fingerprint.packageName = name;
      }, (err) => {
        this.fingerprint.packageName = '(Error)' + err.message;
      });
    }
  }
}

</script>
