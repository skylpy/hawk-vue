<template>
  <f7-page>
    <f7-navbar title="软件设置" back-link></f7-navbar>
  <div>
    <!-- personal information setting -->
    <f7-list>
      <f7-list-item
        v-for="item in settings.software" 
        :title="item.title" 
        :key="item.title" 
        link="#"
        @click="jumpTo(item.link)">
        <f7-icon slot="media" :material="item.icon"></f7-icon>
      </f7-list-item>
    </f7-list>


  </div>
  </f7-page>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {defaultImgUrl} from '../../lib/loading';

export default {
    name: "preference",

  data: () => {
    return {
      settings: {
        software: [
          // { title: "消息订阅", icon: "phonelink_ring", link: "/software/subscriber/" },
          // { title: "提醒设置", icon: "new_releases", link: "/software/reminder/" },
          // { title: "模块管理", icon: "extension", link: "/software/moduleeditor/" },
          { title: "后台设置", icon: "perm_data_setting", link: "/software/system/" },
        ]
      }, // settings
    };
  },

  computed: {
    ...mapGetters([
      'myCompany',
      'myProfile',
      'myUserId',
      'IamAdmin',
      'timeCard',
      'myAvatar'
    ]),

    workdSchedule() {
        let tc = this.timeCard(this.myUserId);
        if (!tc) return { days: '待定', time: '待定'};

        let days = ['一', '二', '三', '四', '五', '六', '日'].filter((d, index) => { return tc.workDays[index]}).join(' ');
        let time = tc.workTimes[0].start + '-' + tc.workTimes[0].end;
        return {days, time};
    },
  },
  methods: {  
    jumpTo(path, properties) {
      this.$f7router.navigate(path, {
        props: properties
      });
    },

    resign() {
      $dialog.confirm('确定要退出当前登录的账户吗？', '退出登陆', (ok) => {
        this.logout();
        self.$f7.views.main.router.navigate('/login/');
      });
    },

    ...mapActions({
      logout: 'LOGOUT',
      reset_company: 'RESET_COM',
    }),
  },
};
</script>
