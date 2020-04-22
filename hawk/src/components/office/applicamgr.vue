<template>
  <f7-page @page:reinit="load">
    <f7-navbar title="考勤管理"
               back-link>
    </f7-navbar>

    <f7-toolbar>
      <f7-link class="toolbar-category"
               @click="changeType">加班</f7-link>
      <f7-link class="toolbar-category"
               @click="changeType">请假</f7-link>
      <f7-link class="toolbar-category"
               @click="changeType">出差</f7-link>
      <f7-link class="toolbar-category"
               @click="changeType">外出</f7-link>
    </f7-toolbar>

    <ul class="attendance"
        v-if="role == 'admin'">
      <li :class="{active: status == 0}"
          @click="status = 0">我审批的</li>
      <li :class="{active: status == 1}"
          @click="status = 1">我发起的</li>
    </ul>

    <f7-list style="margin-top:0px">
      <f7-list-item title="时间范围"
                    smart-select
                    :smart-select-params="{openIn: 'popover'}">
        <select name="range">
          <option value="三天内"
                  selected>三天内</option>
          <option value="一周内">一周内</option>
          <option value="一个月内">一个月内</option>
          <option value="全部">全部</option>
        </select>
      </f7-list-item>
      <f7-list-item title="审批状态"
                    smart-select
                    :smart-select-params="{openIn: 'popover'}">
        <select name="status">
          <option value="全部"
                  selected>全部</option>
          <option value="待审批">待审批</option>
          <option value="已通过">已通过</option>
          <option value="已拒绝">已拒绝</option>
        </select>
      </f7-list-item>
    </f7-list>

    <f7-block-title>{{params.category}}列表</f7-block-title>
    <f7-list media-list
             class="applicamgr-list-layer">
      <f7-list-item v-for="(r, index) in records"
                    :key="index"
                    :title="who(r.applicant).name"
                    link="#"
                    v-if="getIsShow(r)"
                    @click="goto(r)">
        <div slot="after-title"
             style="margin-left:20px">
          <f7-chip outline
                   :text="r.category == '请假' ? r.content.leaveType : r.category"></f7-chip>
          <f7-chip v-if="r.content.startTime"
                   outline
                   :text="(new Date(r.content.startTime)).toHawkDateString()"></f7-chip>
          <f7-chip outline
                   :text="r.status"
                   :color="r.status=='已通过' ? 'green' : (r.status=='已拒绝' ? 'red' : '')"></f7-chip>
        </div>

        <div slot="after">详情</div>
      </f7-list-item>

      <p style="width:100%; text-align:center"
         slot="after-list">
        <small style="color:gray">没有更多的数据</small>
      </p>
    </f7-list>

  </f7-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  props: {
    lastPage: {
      type: String,
      default: '上一页'
    },
    status: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      params: {
        range: '三天内',
        status: '全部',
        category: ''
      },
      loading: false,
      records: [],
      role: 'normal'
    }
  },

  computed: {
    ...mapGetters([
      'who',
      'superAdmin',
      'myUserId',
      'isDepartmentAdmin',
      'myProfile'
    ]),
    // 判断是行政人员
    isFinance () {
      if (!this.myProfile.privilege || this.myProfile.privilege.length == 0) return false
      return this.myProfile.privilege.some(i => ['公司总账', '固定支出', '应收付款', '应付账款', '财务录入', '财务文件', '薪资录入'].includes(i))
    },
    // 判断是财务人员
    isAdministration () {
      if (!this.myProfile.privilege || this.myProfile.privilege.length == 0) return false
      return this.myProfile.privilege.some(i => ['合同管理', '企业设置'].includes(i))
    }

  },

  watch: {
    params: {
      deep: true,
      handler: function (val, oldVal) {
        this.load();
      }
    }
  },

  created () {
    if (this.myUserId == this.superAdmin._id) {
      this.role = 'super'
    } else if (this.isDepartmentAdmin(this.myUserId) || this.isFinance || this.isAdministration) {
      // 允许非部门主管的行政、财务人员看到他审批的申请
      this.role = 'admin'
    } else {
      this.role = 'normal'
    }
  },

  mounted () {
    $('select[name="range"]').change(() => {
      this.params.range = $('select[name="range"] option:checked').attr('value');
      this.$f7.popover.close('.smart-select-popover');
    });
    $('select[name="status"]').change(() => {
      this.params.status = $('select[name="status"] option:checked').attr('value');
      this.$f7.popover.close('.smart-select-popover');
    });

    this.changeType({ target: $('.toolbar-category')[0] });
  },

  methods: {
    goto (application) {
      let page = ({
        '请假': 'leave',
        '加班': 'overtime',
        '出差': 'travel',
        '报销': 'expense',
        '外出': 'goOut'
      }[application.category]);

      if (!page) {
        $alert('无法找到对应的页面', '操作错误');
        return;
      }

      this.records = [];
      this.$f7router.navigate('/office/' + page + '/', {
        props: {
          lastPage: '考勤审批',
          reference: application
        }
      });
    },

    changeType (ev) {
      this.params.category = ev.target.innerText;
      $('.toolbar-category').css('border-bottom', '');
      $(ev.target).css('border-bottom', '5px solid orangered');
    },

    inform (message, title, cb) {
      if (!this.loading) {
        $preloader.show();
        this.loading = true;
      } else {
        $preloader.hide();
        this.loading = false;
        if (message) {
          $alert(message, title || '操作结果', cb);
        }
      }
    },

    getStartTime () {
      let now = new Date();
      let today = (new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime();
      let start = new Date(2000, 0, 1).getTime(); // long long ago
      const oneDayInMillisecons = 24 * 3600 * 1000;

      switch (this.params.range) {
        case '三天内': start = today - 3 * oneDayInMillisecons; break;
        case '一周内': start = today - 3 * oneDayInMillisecons; break;
        case '一个月内': start = today - 3 * oneDayInMillisecons; break;
      }

      return start;
    },

    load () {
      this.inform();
      this.records = [];

      let filters = {
        category: this.params.category,
        createdAfter: this.getStartTime()
      }
      if (this.params.status != '全部') { filters.status = this.params.status; }

      axios.get('api/application?q=' + JSON.stringify(filters)).then(resp => {
        this.records = resp.data;
        this.inform();
      }).catch(err => {
        console.error(err);
        this.inform('无法获取数据，请稍后再试', '操作失败');
      })
    },

    getIsShow (r) {
      console.log(r)
      let isShow = false;
      if (this.role == 'super') {
        isShow = true;
      } else if (this.role == 'admin') {
        // applicant approver
        if (this.status == 0 && r.approver == this.myUserId) {
          isShow = true;
        } else if (this.status == 1 && r.applicant == this.myUserId) {
          isShow = true;
        }
      } else {
        if (r.applicant == this.myUserId) {
          isShow = true;
        }
      }
      return isShow
    }
  }


}
</script>

<style lang="scss" scoped>
.attendance {
  width: 100%;
  height: 46px;
  line-height: 46px;
  background: #fff;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  margin-top: 0;
  list-style: none;
  text-align: center;

  li {
    position: relative;
    width: 50%;
    float: left;

    &.active {
      color: #01b38b;
      &:after {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 90px;
        height: 2px;
        content: "";
        display: block;
        background: #01b38b;
      }
    }
  }
}

.applicamgr-list-layer {
  height: calc(100% - 210px);
  margin: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
