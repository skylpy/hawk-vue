<template>
    <!--
        add class="input-photo" to f7-list-item when importing this component
    -->
        <f7-block style="display:flex; flex-wrap:wrap; margin:0">

            <div
                    class="image-wrap"
                    v-for="(f, index) in imgSrc"
                    :key="index"
            >
                <a href="#" @click="remove(index)" v-if="!readonly">
                    <i class="fa fa-window-close"></i>
                </a>

                <img :src="f" @click="browse">
            </div>

            <!--<f7-button-->
            <!--v-if="showBtn"-->
            <!--big outline :style="btnStyle"-->
            <!--@click = "take"-->
            <!--&gt;-->
            <!--<f7-icon f7="camera"></f7-icon>-->
            <!--</f7-button>-->
            <img v-if="showBtn" @click = "take" :style="btnStyle" src="../../assets/images/btn_add_pic_rectangle@2x.png">

            <div class="no-photo" v-if="readonly && this.photo.length == 0">没有照片</div>

            <f7-actions :id="'photoeditor_'+actionId">
                <f7-actions-group>
                    <f7-actions-button @click="takePicture()">拍摄</f7-actions-button>
                    <f7-actions-button @click="takePicture(true)">从相册选择</f7-actions-button>
                </f7-actions-group>
                <f7-actions-group>
                    <f7-actions-button color="red">取消</f7-actions-button>
                </f7-actions-group>
            </f7-actions>
        </f7-block>

</template>

<style scoped>
.image-wrap {
    width: 60px;
    height: 60px;
    position: relative;
    margin-top: 10px;
    margin-right: 5px
}
.image-wrap img {
    width: 100%;
    height: 100%;
}
.image-wrap a {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    color: red;
    line-height: 0;
}
.no-photo {
    width: 100%;
    font-size: small;
    color: gray;
    text-align: center;
}
</style>


<script>
import {defaultImgUrl} from 'lib/loading';
import {openCamera, openFilePicker} from 'lib/camera';
import {upload, getSignUrl} from 'lib/aliyun';
import {mapGetters} from 'vuex';

export default {
    name: 'photoeditor',

    props: {
        gallery: {
            type: Boolean,
            default: false
        },
        photos: {
            type: Array,
            default: () => []
        },
        max: {
            type: Number,
            default: 5
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            actionId:Date.now(),
            imgSrc: [],
            photo: this.photos.slice(0),

            btnStyle: {
                width: "60px",
                height: "60px",
                border: "none",
                "background-color": "white",
                "margin-top": "10px",
                // opacity: "0.8"
            },

        }
    },

    computed: {
        ...mapGetters(['myProfile']),

        showBtn() {
            if (this.readonly) return false;
            if (this.max && this.max <= this.photo.length) return false;
            return true;
        }
    },

    watch: {
        photo: function(value) {
            console.log('getting new photo', value);
            this.showImg()
            if (!this.readonly) this.$emit('photo:update', this.photo);
        },

        photos: function(value) {
            console.log('getting new photos', value);
            if (value && value != this.photo) this.photo = value.slice(0);
        }
    },
    mounted(){
        this.showImg();
    },
    methods: {
        browse(ev) {
            this.openPhotoBrowser(ev);
        },
        showImg() {
            this.imgSrc = [];
            this.photo.forEach((p, index) => {
                this.imgSrc[index] = defaultImgUrl;
                let url = p.substr(0, 4) == 'http' ? p.match(/aliyuncs.com\/(\S*)\?OSSAccessKeyId/)[1] : p
                getSignUrl(url, (ret) => {
                    if (ret instanceof Error) {
                        this.imgSrc[index] = '#';
                    } else {
                        this.imgSrc[index] = ret;
                        this.$forceUpdate()
                    }
                });
            });
        },

        remove(index) {
            let update = this.photo.slice(0);
            update.splice(index, 1);
            this.photo = update;
        },

        take() {
            if (this.gallery) {
                $f7.actions.open('#photoeditor_'+this.actionId);
                return;
            }
            this.takePicture(null, false);
        },

        takePicture(fromFile) {
            let self = this;

            let cb = function(ret) {
                if (ret instanceof Error) {
                    console.error(ret);
                } else {
                    let dataUrl = ret;
                    $preloader.show();

                    upload(dataUrl, (ret) => {
                        $preloader.hide();

                        if (ret instanceof Error) {
                            console.error(ret);
                            $alert('无法上传照片', '操作失败');
                        } else {
                            self.photo.push(ret);
                        }
                    });
                }
            };

            if (!fromFile) openCamera(cb);
            if (fromFile) openFilePicker(cb, true, false);
        },

        openPhotoBrowser(ev) {
            let photos = this.imgSrc;
            let pb = $f7.photoBrowser.create({ photos });

            pb.on('closed', () => { pb.destroy(); })
            pb.open();
        }
    }
}
</script>
