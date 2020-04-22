<template>
    <f7-page class="help_content">
        <f7-navbar :title="name" back-link></f7-navbar>
        <div class="h_c">
            <template v-if="contentList">
                <article v-for="(v, i) in contentList" :key="i">
                    <p v-if="v.content">{{v.content}}</p>
                    <img v-if="v.img" :src="getImgSrc(v.img)" style="width: 100%" />
                </article>
            </template>

            <template v-else>
                <div>{{content}}</div>
                <div style="padding: 0 20px">
                    <img v-if="img" :src="getImgSrc(img)" style="width: 100%" />
                </div>
            </template>
        </div>
        <div class="bt_save" v-if="go" @click="goToSetting">
            <div>马上去设置</div>
        </div>
    </f7-page>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: "help_content",
    props: ['name', 'content', 'go', 'img', 'contentList'],
    computed: {
      ...mapGetters([
          'myProfile'
      ])
    },
    methods: {
        goToSetting () {
            this.go(this)
        },
        getImgSrc (url) {
            return require(`assets/images/${url}`)
        }
    }
}
</script>

<style lang="scss">
.help_content {
    .h_c {
        height: calc(100% - 45px);
        padding: 0 !important;
        overflow: auto;

        div {
            font-size: 20px;
            line-height: 32px;
            color: gray;
            padding: 20px;
        }

        article {
            padding: 0 20px;
        }

        p {
            font-size: 20px;
            line-height: 32px;
            color: gray;
            margin-bottom: 0;
        }
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
}
</style>
