export const h_superAdmin = [
  {
    name: '锁定三帆软件操作指引',
    children: [
      {
        name: '设置进程锁定',
        contentList: [
          {content: '我们APP若被系统进程自动关闭或者人为关闭后，将影响部分功能使用，例如：实时查岗、聊天信息提示，相关日报汇报推送等，需要设置手机进程白名单'},
          {content: '华为机的后台设置：设置——>电池——>启动管理——>找到三帆外勤，点击进出，把允许自启动，允许关联启动，允许后台启动三个选项都勾上再确定，就OK。'},
          {content: 'OPPO手机的后台设置：设置——>电池——>耗电保护或者应用速冻——>找到三帆外勤，并关闭即可。'},
          {content: '三星手机的后台设置：设置——>常规管理——>电池——>未监视的应用程序——>添加应用程序，选择三帆外勤。'},
          {content: '魅族手机的后台设置：设置——>应用管理——>已安装列表找到三帆外勤进入——>权限管理——>后台管理，点击选择允许后台运行。'},
          {content: '图文操作以小米为例：'},
          {content: '第一步： 打开设置，点击电量和性能' },
          {img: 'white_list_1.png'},
          {content: '第二步： 点击应用配置' },
          {img: 'white_list_2.png'},
          {content: '第三步： 点击三帆外勤' },
          {img: 'white_list_3.png'},
          {content: '第四步： 选择无限制' },
          {img: 'white_list_4.png'},
          {content: '第五步： 点击任务管理器按钮，弹出后台应用进程界面' },
          {img: 'white_list_5.png'},
          {content: '第六步： 长按三帆外勤，选择锁定' },
          {img: 'white_list_6.png'}
        ]
      },
      {
        name: '清理后台进程注意事项（重点）',
        remark: true,
        contentList: [
          {content: '如果不这样操作，进程可能会误删，导致实时查岗无法正常定位、聊天信息和所有消息推送无法收到。'},
          {content: '图文操作以华为为例：'},
          {content: '第一步： 打开后台进程' },
          {img: 'white_list_7.png'},
          {content: '第二步： 如果三帆外勤软件没有锁上，请点击锁上' },
          {img: 'white_list_8.png'},
          {content: '第三步： 当你需要清理后台进程的时候，记得一定不能点击三帆外勤软件右上角X按钮退出软件，而且点击垃圾桶清除非白名单的软件' },
          {img: 'white_list_9.png'},
        ]
      }
    ]
  },
  {
    name: '选择企业',
    children: [
      {
        name: '多公司账号登录',
        content: '同一个手机号可以注册多个公司，登陆时选择对应的公司即可，不同公司之间数据完全独立。'
      }
    ]
  },
  {
    name: '企业设置',
    children: [
      {
        name: '考勤设置',
        content: '考勤分两个类型：上下班、实时打卡。实时打卡属于外勤打卡，可不限地点；上下班打卡则固定打卡地点。通过考勤组页面的新增考勤组按钮添加，接下来我们来操作新增考勤组。',
        go: (self) => {
          self.$f7router.navigate('/setting/company/timecards', {
            props: {
              lastPage: '公司设置'
            }
          });
        }
      },
      {
        name: '职位类型',
        content: '通过编辑按钮和新增按钮可编译我们的职位信息，便于新增员工时指定其职位。',
        go: (self) => {
          self.$f7router.navigate('/setting/meta/',
            {
              props: {
                lastPage: '公司设置',
                navTitle: '职位类型',
                dataType: 'jobType'
              }
            }
          );
        }
      },
      {
        name: '组织架构',
        content: '此功能可为我们新增部门和员工，通过底部的添加部门和添加员工操作，并且部门允许设置多级子部门，操作顺序：先添加部门，再添加员工。接下来我们来操作新增部门和员工。',
        go: (self) => {
          self.$f7router.navigate('/office/organization');
        }
      },
      {
        name: '权限管理',
        content: '这里可为我们设置部门对应部门管理员，及财务和行政人员，选定对应的角色后通过“+”按钮操作，选定了人员和部门后还可设置其具体权限。另外还有设置超级管理员，此操作可把超级管理员权限转移给他人，而设置临时权限是可对特定员工临时授权。接下来我们来设置权限。注意：权限不一样，使用者看到的主界面和功能也不一样',
        go: (self) => {
          self.$f7router.navigate('/office/privilege/');
        }
      }
    ]
  },
  {
    name: '考勤模块',
    children: [
      {
        name: '我的考勤',
        content: '在此页面的右上角打卡记录可查看公司员工的考勤打卡情况。',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/');
        }
      },
      {
        name: '请假类型',
        content: '预设一些请假类型，便于员工在申请请假选择对应的类型。',
        go: (self) => {
          self.$f7router.navigate('/setting/meta/', {
            props: {
              lastPage: '公司设置',
              navTitle: '请假类型',
              dataType: 'leaveType'
            }
          });
        }
      },
      {
        name: '考勤管理',
        content: '可查看公司员工对自己发起的加班、请假、出差、外出申请记录，并可操作批准或驳回。',
        go: (self) => {
          self.$f7router.navigate('/office/applicamgr/');
        }
      }
    ]
  },
  {
    name: '轨迹查岗',
    children: [
      {
        name: '实时查岗',
        content: '超级管理员通过此功能可查看自己和选择查看公司所有员工的手机定位情况。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。',
        go: (self) => {
          self.$f7router.navigate('/office/position/');
        }
      },
      {
        name: '工作轨迹',
        content: '超级管理员通过此功能可查看自己和和选择查看公司所有员工的工作轨迹路线。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。',
        go: (self) => {
          self.$f7router.navigate('/office/trace/');
        }
      }
    ]
  },
  {
    name: '费用报销',
    children: [
      {
        name: '报销类型',
        content: '在员工操作报销申请之前，我们可以预设一些报销类型。',
        go: (self) => {
          self.$f7router.navigate('/setting/expense/', {
            props: {
              lastPage: '公司设置',
              navTitle: '报销类型',
              dataType: 'leaveType'
            }
          });
        }
      },
      {
        name: '待我审批',
        content: '查看员工对自己发起的报销申请，并可对报销记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看自己发起的报销申请记录',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '通讯录',
    children: [
      {
        name: '通讯录',
        content: '此功能类似微信聊天可对公司员工发起聊天，通过信息按钮打开聊天窗口，可发送文字、表情、相片文件。并可通过电话按钮拨打电话。',
        go: (self) => {
          self.$f7router.navigate('/office/contacts/');
        }
      }
    ]
  },
  {
    name: '任务模块',
    children: [
      {
        name: '任务管理',
        content: '此功能可新建任务给员工并让其去执行，通过直属员工页面可查看员工任务执行情况，并可在待处理栏位对任务作完成、未完成、延时的处理。'
      },
      {
        name: '任务类型',
        content: '新建任务之前我们可预设一些任务类型，便于区分每个任务的类型。',
        go: (self) => {
          self.$f7router.navigate('/setting/meta/', {
            props: {
              lastPage: '公司设置',
              navTitle: '任务类型',
              dataType: 'taskType'
            }
          });
        }
      },
      {
        name: '新建任务给下属',
        content: '新建任务给下属',
        go: (self) => {
          self.$f7router.navigate('/office/task/');
        }
      },
      {
        name: '查看员工任务执行情况',
        content: '查看员工任务执行情况',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/');
        }
      }
    ]
  },
  {
    name: '客户模块',
    children: [
      {
        name: '客户区域',
        content: '为客户设定分布的主要城市，通过新增区域按钮操作，可分省份城市结构设置',
        go: (self) => {
          self.$f7router.navigate('/setting/tree/', {
            props: {
              lastPage: '公司设置',
              name: '区域',
              src: 'regions'
            }
          });
        }
      },
      {
        name: '客户等级',
        content: '用于区分客户重要性级别，通过新增客户等级按钮操作',
        go: (self) => {
          self.$f7router.navigate('/setting/meta/', {
            props: {
              lastPage: '公司设置',
              navTitle: '客户等级',
              dataType: 'clientGrade'
            }
          });
        }
      },
      {
        name: '客户类型',
        content: '为客户设定主要的某些类型，例如实体店、线上代理商之类，通过新增客户类型按钮操作',
        go: (self) => {
          self.$f7router.navigate('/setting/meta/', {
            props: {
              lastPage: '公司设置',
              navTitle: '客户类型',
              dataType: 'clientType'
            }
          });
        }
      },
      {
        name: '意向类型',
        content: '用于设置客户当前的成交阶段',
        go: (self) => {
          self.$f7router.navigate('/setting/meta/', {
            props: {
              lastPage: '公司设置',
              navTitle: '意向类型',
              dataType: 'intentionType'
            }
          });
        }
      },
      {
        name: '查看新增的客户',
        content: '查看新增的客户',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'clientToolBar'
            }
          });
        }
      },
      {
        name: '查看新增的商家',
        content: '查看新增的商家',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'businessToolBar'
            }
          });
        }
      },
      {
        name: '查看下属私有',
        content: '这里看查看下属新建的私有客户或商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'privateToolBar'
            }
          });
        }
      },
      {
        name: '新增客户、商家',
        content: '点击右下角加号按钮弹出的菜单即可进行新增操作。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'add'
            }
          });
        }
      },
      {
        name: '扫名片',
        content: '此功能可通过扫码名片方式增加客户或增加联系人。',
        go: (self) => {
          self.$f7router.navigate('/client/ocr/', {
            props: {
              which: true
            }
          });
        }
      }
    ]
  },
  {
    name: '拜访管理',
    children: [
      {
        name: '拜访设置',
        content: '拜访有两个类型：走访、电话。在给下属分派拜访任务之前，我们需要先对拜访设定基本设置，包括电话拜访分钟限制数（电话拜访最低通话时间）、总结内容字数限制等等。 ',
        go: (self) => {
          self.$f7router.navigate('/client/visitset/', {
            props: {
              lastPage: '公司设置',
              navTitle: '拜访设置',
              dataType: 'leaveType'
            }
          });
        }
      },
      {
        name: '新建拜访任务',
        content: '超级管理员或上级可以分派拜访任务给下级员工，以拜访客户为例（商家类似）进入',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'addVisit'
            }
          });
        }
      },
      {
        name: '查看我派发的拜访任务',
        content: '通过拜访管理的列表可查看本人派发出去的拜访任务',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'sListToolbar'
            }
          });
        }
      },
      {
        name: '查看拜访统计',
        content: '需要查看周期范围内，公司和某部门或某个人总共拜访数量，包括电话拜访、走访客户数，可在拜访管理—统计页面这里查看。',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'statisticsToolbar'
            }
          });
        }
      }
    ]
  },
  {
    name: '通知公告',
    children: [
      {
        name: '发布通知',
        content: '通过发布通知内容可通知相关人员，接下来我们创建一个公告',
        go: (self) => {
          self.$f7router.navigate('/office/announce/');
        }
      },
      {
        name: '查看已发布的公告',
        content: '注：只有超级管理员、行政、部门管理才有权限发布通告和删除通告。',
        go: (self) => {
          self.$f7router.navigate('/office/announcemgr/');
        }
      }
    ]
  },
  {
    name: '用车申请',
    children: [
      {
        name: '用车类型',
        content: '申请用车之前，我们先设置车型。',
        go: (self) => {
          self.$f7router.navigate('/setting/car/', {
            props: {
              lastPage: '公司设置',
              navTitle: '车辆类型'
            }
          });
        }
      },
      {
        name: '申请用车',
        content: '在此发起申请用车。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/apply/');
        }
      },
      {
        name: '用车审批',
        content: '查看员工向自己发起的用车申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用车列表',
        content: '查看我的用车申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/carList/');
        }
      }
    ]
  },
  {
    name: '用章申请',
    children: [
      {
        name: '用章类型',
        content: '申请用章之前，我们先设置印章类型。',
        go: (self) => {
          self.$f7router.navigate('/setting/seal/', {
            props: {
              lastPage: '公司设置',
              navTitle: '车辆类型'
            }
          });
        }
      },
      {
        name: '申请用章',
        content: '在此发起申请用章。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/apply/');
        }
      },
      {
        name: '用章审批',
        content: '查看员工向自己发起的用章申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用章列表',
        content: '查看我的用章申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/');
        }
      }
    ]
  },
  {
    name: '采购申请',
    children: [
      {
        name: '待我审批',
        content: '查看员工向自己发起的采购申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的采购记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的采购申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '付款申请',
    children: [
      {
        name: '付款方式',
        content: '在员工操作付款申请之前，我们可以预设一些付款方式。',
        go: (self) => {
          self.$f7router.navigate('/setting/paymenttype/', {
            props: {
              lastPage: '公司设置',
              navTitle: '付款方式'
            }
          });
        }
      },
      {
        name: '待我审批',
        content: '查看员工向自己发起的付款申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '合同审批',
    children: [
      {
        name: '发起合同审批',
        content: '发起合同审批。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起得合同申请，并可对申请记录操作通过或拒绝。通过后，附件将自动上传到合同管理根目录里。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的合同审批记录。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '绩效报告',
    children: [
      {
        name: '审批列表',
        content: '查看员工向自己发起的绩效报告，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '绩效报告列表',
        content: '查看自己的绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '物品领用',
    children: [
      {
        name: '审批列表',
        content: '查看员工向自己发起的物品领用，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '物品领用列表',
        content: '查看自己申请的物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '销售业绩',
    children: [
      {
        name: '审批列表',
        content: '查看员工向自己发起的销售业绩，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '销售业绩列表',
        content: '查看自己的销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '邀约到访',
    children: [
      {
        name: '审批列表',
        content: '查看员工向自己发起的邀约到访，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '邀约到访列表',
        content: '查看自己申请的邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '数据汇报与统计',
    children: [
      {
        name: '编辑汇报模板',
        content: '需要下属部门提交汇报，要先设置提交的汇报模板，包括提交的数据项、提交周期、提交开始结束时间。',
        go: (self) => {
          self.$f7router.navigate('/report/selectdepartment');
        }
      },
      {
        name: '查看员工汇报内容',
        content: '默认显示最近三天的汇报记录。',
        go: (self) => {
          self.$f7router.navigate('/report/statistics/', {
            props: {
              which: 'tabStatistic'
            }
          });
        }
      },
      {
        name: '查看汇报统计',
        content: '可分周期查看公司或部门个人的汇总数和对应图表展。注：员工提交的汇报第二天才显示统计图表',
        go: (self) => {
          self.$f7router.navigate('/report/statistics/');
        }
      }
    ]
  },
  {
    name: '日报模块',
    children: [
      {
        name: '日报设置',
        content: '注：由于目前日报只能为当前部门设定，故超级管理员只能委派下属管理员去设置各自的部门。',
        go: (self) => {
          self.$f7router.navigate('/office/journalset/', {
            props: {
              lastPage: '公司设置',
              navTitle: '日报设置',
              dataType: 'leaveType'
            }
          });
        }
      },
      {
        name: '查看下属日报',
        content: '查看下属日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalList/', {
            props: {
              which: true
            }
          });
        }
      }
    ]
  },
  {
    name: '合同管理',
    children: [
      {
        name: '新建目录',
        content: '点击“+”按钮弹出的新建文件夹按钮，可新建文件夹。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/office/contracts/', {
            props: {title: '合同', root: 'contracts', which: 'choose_action'}
          });
        }
      },
      {
        name: '上传文件',
        content: '点击“+”按钮弹出的上传文件按钮，可把文件上传到当前目录中。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/office/contracts/', {
            props: {title: '合同', root: 'contracts', which: 'choose_action'}
          });
        }
      },
      {
        name: '下载文件',
        content: '点击文件右边的小圆点选定了文件后，根据下面弹出的选项选择下载即可。下载后的文件都存放在手机文件目录：hawkDownloads里。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/office/contracts/', {
            props: {title: '合同', root: 'contracts', which: 'select'}
          });
        }
      }
    ]
  },
  {
    name: '财务文件',
    children: [
      {
        name: '新建目录',
        content: '点击“+”按钮弹出的新建文件夹按钮，可新建文件夹。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/finance/docs/', {
            props: {title: '财务', root: 'financialdocs', which: 'choose_action'}
          });
        }
      },
      {
        name: '上传文件',
        content: '点击“+”按钮弹出的上传文件按钮，可把文件上传到当前目录中。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/finance/docs/', {
            props: {title: '财务', root: 'financialdocs', which: 'choose_action'}
          });
        }
      },
      {
        name: '下载文件',
        content: '点击文件右边的小圆点选定了文件后，根据下面弹出的选项选择下载即可。下载后的文件都存放在手机文件目录：hawkDownloads里。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/finance/docs/', {
            props: {title: '财务', root: 'financialdocs', which: 'select'}
          });
        }
      }
    ]
  },
  {
    name: '财务管理',
    children: [
      {
        name: '财务设置',
        content: '这里可为我们设定默认的三级审核人，设了在新建财务单据时可默认审核人，不设则每次提交要手动选择。注：每笔财务记录都需要经过三级审核流程，分别是：审核人、审批人、出纳人。发起的财务记录，都会在财务审批页面操作审批确定，三级都审核通过的记录才会汇入公司总账。',
        go: (self) => {
          self.$f7router.navigate('/setting/finance/', {
            props: {
              lastPage: '公司设置',
              navTitle: '财务设置',
              dataType: 'leaveType'
            }
          });
        }
      }
    ]
  },
  {
    name: '应收账款',
    children: [
      {
        name: '新建应收账款',
        content: '新建应收账款',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_new',
              name: '应收账款',
              shortname: '应收',
              reference: { code: 'YS' }
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_search',
              name: '应收账款',
              shortname: '应收',
              reference: { code: 'YS' }
            }
          });
        }
      },
      {
        name: '查看历史记录',
        content: '查看历史记录',
        go: (self) => {
          self.$f7router.navigate('/finance/receivable/', {
            props: {
              which: 'selectMonth'
            }
          });
        }
      }
    ]
  },
  {
    name: '应付账款',
    children: [
      {
        name: '新建应付账款',
        content: '新建应付账款',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_new',
              name: '应付账款',
              shortname: '应付',
              reference: { code: 'YF' }
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_search',
              name: '应付账款',
              shortname: '应付',
              reference: { code: 'YF' }
            }
          });
        }
      },
      {
        name: '查看历史记录',
        content: '查看历史记录',
        go: (self) => {
          self.$f7router.navigate('/finance/payable/', {
            props: {
              which: 'selectMonth'
            }
          });
        }
      }
    ]
  },
  {
    name: '固定支出',
    children: [
      {
        name: '新建固定支出',
        content: '新建固定支出',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_new',
              name: '固定支出',
              shortname: '支出',
              reference: { code: 'GZ' }
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_search',
              name: '固定支出',
              shortname: '支出',
              reference: { code: 'GZ' }
            }
          });
        }
      },
      {
        name: '查看历史记录',
        content: '查看历史记录',
        go: (self) => {
          self.$f7router.navigate('/finance/fixedCost/', {
            props: {
              which: 'selectMonth'
            }
          });
        }
      }
    ]
  },
  {
    name: '财务录入',
    children: [
      {
        name: '新建财务录入',
        content: '新建财务录入',
        go: (self) => {
          self.$f7router.navigate('/finance/entry/', {
            props: {
              which: 'add'
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/entry/', {
            props: {
              which: 'search'
            }
          });
        }
      }
    ]
  },
  {
    name: '财务审批',
    children: [
      {
        name: '财务审批',
        content: '此功能可对所有财务板块对本人发起的审批记录操作通过或驳回。',
        go: (self) => {
          self.$f7router.navigate('/finance/auditlist/');
        }
      }
    ]
  },
  {
    name: '公司总账',
    children: [
      {
        name: '公司总账',
        content: '此窗口可查看当日收入、支出及结存余额。收入列表、支出列表进入可查看对应的收支记录。详细搜索功能与上类似。',
        go: (self) => {
          self.$f7router.navigate('/finance/ledger/');
        }
      }
    ]
  },
  {
    name: '考核设置',
    children: [
      {
        name: '薪资录入',
        content: '在设置考核之前，我们先设置员工的薪资。（一元等同于一分）',
        go: (self) => {
          self.$f7router.navigate('/finance/salary/');
        }
      },
      {
        name: '考勤考核',
        content: '可对员工设置迟到早退漏卡等的扣分，考核设置还包括开始结束时间、执行人。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'attendance',pageName:'考勤'}
          });
        }
      },
      {
        name: '日报考核',
        content: '可对员工设置不交日报的扣分。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'daily',pageName:'日报'}
          });
        }
      },
      {
        name: '拜访考核',
        content: '可对员工未完成拜访扣分和完成后加分，可分周期日、周、月设定，包括走访、电访数设置。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'visit',pageName:'拜访'}
          });
        }
      },
      {
        name: '任务考核',
        content: '可对员工设置完成任务的加分与未完成任务的扣分。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'task',pageName:'任务'}
          });
        }
      },
      {
        name: '汇报考核',
        content: '可对员工设置不交汇报的扣分。注：其中的模板考核设置项意思是对应前面汇报模板中的考核达标项，达到加多少，未达到扣多少，可分多档位设定。',
        img: 'pic_operational_guideline@2x.png',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'report',pageName:'汇报'}
          });
        }
      },
      {
        name: '自定义加减',
        content: '可直接对员工操作加分或减分，可用于临时奖励或惩罚。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'custom',pageName:'自定义'}
          });
        }
      }
    ]
  },
  {
    name: '考核结算',
    children: [
      {
        name: '考核结算',
        content: '此功能可查看员工的加分扣分情况，刚进入页面默认会显示直属员工的考核。',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonallist/');
        }
      },
      {
        name: '查看其他员工考核',
        content: '查看其他员工考核',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonallist/', {
            props: {
              which: 'selectorPersonnelShow'
            }
          });
        }
      }
    ]
  },
  {
    name: '企业支付',
    children: [
      {
        name: '查看企业套餐',
        content: '注：超级管理员登陆账号过期，若还需使用，需要续费，账号会一直保留。',
        go: (self) => {
          self.$f7router.navigate('/trade/info');
        }
      },
      {
        name: '套餐续费',
        content: '套餐续费',
        go: (self) => {
          if (device.platform == "iOS"){
            $alert('IOS端暂不支持付费，如果需要付费开通，请更换到安卓手机端进行付费操作', '温馨提示');
            return;
          }
          self.$f7router.navigate('/trade/buy/', {
            props: {orderType: 'RENEWAL'}
          });
        }
      },
      {
        name: '添加使用名额',
        content: '添加使用名额',
        go: (self) => {
          self.$f7router.navigate('/trade/info', {
            props: {
              which: 'addUser'
            }
          });
        }
      }
    ]
  },
  {
    name: '售后服务',
    children: [
      {
        name: '上门服务',
        content: '任何APP使用问题或功能建议，需要三帆外勤上门服务的，可预约上门服务。只需在预约页面填写好相关联系信息。打开位置：关于我们的服务协议下方。',
        go: (self) => {
          self.$f7router.navigate('/software/visitingService/');
        }
      }
    ]
  }
];

export const h_department = [
  {
    name: '锁定三帆软件操作指引',
    children: [
      {
        name: '设置进程锁定',
        contentList: [
          {content: '我们APP若被系统进程自动关闭或者人为关闭后，将影响部分功能使用，例如：实时查岗、聊天信息提示，相关日报汇报推送等，需要设置手机进程白名单'},
          {content: '华为机的后台设置：设置——>电池——>启动管理——>找到三帆外勤，点击进出，把允许自启动，允许关联启动，允许后台启动三个选项都勾上再确定，就OK。'},
          {content: 'OPPO手机的后台设置：设置——>电池——>耗电保护或者应用速冻——>找到三帆外勤，并关闭即可。'},
          {content: '三星手机的后台设置：设置——>常规管理——>电池——>未监视的应用程序——>添加应用程序，选择三帆外勤。'},
          {content: '魅族手机的后台设置：设置——>应用管理——>已安装列表找到三帆外勤进入——>权限管理——>后台管理，点击选择允许后台运行。'},
          {content: '图文操作以小米为例：'},
          {content: '第一步： 打开设置，点击电量和性能' },
          {img: 'white_list_1.png'},
          {content: '第二步： 点击应用配置' },
          {img: 'white_list_2.png'},
          {content: '第三步： 点击三帆外勤' },
          {img: 'white_list_3.png'},
          {content: '第四步： 选择无限制' },
          {img: 'white_list_4.png'},
          {content: '第五步： 点击任务管理器按钮，弹出后台应用进程界面' },
          {img: 'white_list_5.png'},
          {content: '第六步： 长按三帆外勤，选择锁定' },
          {img: 'white_list_6.png'}
        ]
      },
      {
        name: '清理后台进程注意事项（重点）',
        remark: true,
        contentList: [
          {content: '如果不这样操作，进程可能会误删，导致实时查岗无法正常定位、聊天信息和所有消息推送无法收到。'},
          {content: '图文操作以华为为例：'},
          {content: '第一步： 打开后台进程' },
          {img: 'white_list_7.png'},
          {content: '第二步： 如果三帆外勤软件没有锁上，请点击锁上' },
          {img: 'white_list_8.png'},
          {content: '第三步： 当你需要清理后台进程的时候，记得一定不能点击三帆外勤软件右上角X按钮退出软件，而且点击垃圾桶清除非白名单的软件' },
          {img: 'white_list_9.png'},
        ]
      }
    ]
  },
  {
    name: '考勤模块',
    children: [
      {
        name: '考勤打卡',
        content: '在我的考勤此页面点击红色打卡按钮即可进行打卡。',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/', {
            props: {
              which: 'checkin'
            }
          });
        }
      },
      {
        name: '加班、请假、出差、外出申请',
        content: '加班、请假、出差、外出申请',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/', {
            props: {
              which: 'fRightBottom'
            }
          });
        }
      },
      {
        name: '考勤管理',
        content: '可查看自发起的加班、请假、出差、外出申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/applicamgr/', {
            props: {
              status: 1
            }
          });
        }
      },
      {
        name: '考勤审批',
        content: '查看下属提交的加班、请假、出差、外出申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/applicamgr/', {
            props: {
              status: 0
            }
          });
        }
      }
    ]
  },
  {
    name: '轨迹查岗',
    children: [
      {
        name: '实时查岗',
        content: '部门管理员通过此功能可查看自己和选择查看下属员工的手机定位情况。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。',
        go: (self) => {
          self.$f7router.navigate('/office/position/');
        }
      },
      {
        name: '工作轨迹',
        content: '部门管理员通过此功能可查看自己和和选择查看公司所有员工的工作轨迹路线。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。',
        go: (self) => {
          self.$f7router.navigate('/office/trace/');
        }
      }
    ]
  },
  {
    name: '费用报销',
    children: [
      {
        name: '申请报销',
        content: '在此可发起报销申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/expensebxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工对自己发起的报销申请，并可对报销记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '已审批列表',
        content: '已审批列表',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 5
            }
          });
        }
      }
    ]
  },
  {
    name: '通讯录',
    children: [
      {
        name: '通讯录',
        content: '此功能类似微信聊天可对公司员工发起聊天，通过信息按钮打开聊天窗口，可发送文字、表情、相片文件。并可通过电话按钮拨打电话。',
        go: (self) => {
          self.$f7router.navigate('/office/contacts/', {});
        }
      }
    ]
  },
  {
    name: '任务模块',
    children: [
      {
        name: '任务管理',
        content: '此功能可新建任务给员工并让其去执行，通过直属员工页面可查看员工任务执行情况，并可在待处理栏位对任务作完成、未完成、延时的处理。'
      },
      {
        name: '新建任务给下属',
        content: '新建任务给下属',
        go: (self) => {
          self.$f7router.navigate('/office/task/', {});
        }
      },
      {
        name: '可新建任务给本人',
        content: '可新建任务给本人',
        go: (self) => {
          self.$f7router.navigate('/office/task/', {
            props: {userId: self.myProfile._id}
          });
        }
      },
      {
        name: '查看员工任务执行情况',
        content: '查看员工任务执行情况',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {});
        }
      },
      {
        name: '查看本人任务情况',
        content: '查看本人任务情况',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      },
      {
        name: '进行任务与完成任务',
        content: '可长按拖动自己的任务到进行中、完成或未完成。',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      }
    ]
  },
  {
    name: '客户模块',
    children: [
      {
        name: '查看新增的客户',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'clientToolBar'
            }
          });
        }
      },
      {
        name: '查看新增的商家',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'businessToolBar'
            }
          });
        }
      },
      {
        name: '查看下属私有',
        content: '这里看查看下属新建的私有客户或商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'privateToolBar'
            }
          });
        }
      },
      {
        name: '新增客户、商家',
        content: '点击右下角加号按钮弹出的菜单即可进行新增操作。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'add'
            }
          });
        }
      },
      {
        name: '扫名片',
        content: '此功能可通过扫码名片方式增加客户或增加联系人。',
        go: (self) => {
          self.$f7router.navigate('/client/ocr/', {
            props: {
              which: true
            }
          });
        }
      }
    ]
  },
  {
    name: '拜访管理',
    children: [
      {
        name: '新建拜访任务',
        content: '拜访有两个类型：走访、电话。上级可以分派拜访任务给下级员工，以拜访客户为例（商家类似）， 新建任务给本人操作相同。',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'addVisit'
            }
          });
        }
      },
      {
        name: '查看我派发的拜访任务',
        content: '通过拜访管理的列表可查看本人派发出去的拜访任务',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'sListToolbar'
            }
          });
        }
      },
      {
        name: '完成拜访任务',
        content: '打开对应的任务，点击最下面的拜访打卡或电话拜访即可完成拜访，注：电话通话时间要按照通话时间设置，否则不予通过。'
      },
      {
        name: '查看拜访统计',
        content: '需要查看周期范围内，公司和某部门或某个人总共拜访数量，包括电话拜访、走访客户数，可在拜访管理—统计页面这里查看。 ',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'statisticsToolbar'
            }
          });
        }
      }
    ]
  },
  {
    name: '通知公告',
    children: [
      {
        name: '发布通知',
        content: '通过发布通知内容可通知相关人员，接下来我们创建一个公告',
        go: (self) => {
          self.$f7router.navigate('/office/announce/');
        }
      },
      {
        name: '查看已发布的公告',
        content: '注：只有超级管理员、行政、部门管理才有权限发布通告和删除通告。',
        go: (self) => {
          self.$f7router.navigate('/office/announcemgr/');
        }
      }
    ]
  },
  {
    name: '用车申请',
    children: [
      {
        name: '申请用车',
        content: '在此发起申请用车。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/apply/');
        }
      },
      {
        name: '用车审批',
        content: '查看员工向自己发起的用车申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用车列表',
        content: '查看我的用车申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/carList/');
        }
      }
    ]
  },
  {
    name: '用章申请',
    children: [
      {
        name: '申请用章',
        content: '在此发起申请用章。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/apply/');
        }
      },
      {
        name: '用章审批',
        content: '查看员工向自己发起的用章申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用章列表',
        content: '查看我的用章申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/');
        }
      }
    ]
  },
  {
    name: '采购申请',
    children: [
      {
        name: '采购申请',
        content: '在此可发起采购申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/procurementbxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工向自己发起的采购申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的采购记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的采购申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '付款申请',
    children: [
      {
        name: '付款申请',
        content: '在此可发起付款申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/paymentbxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工向自己发起的付款申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '合同审批',
    children: [
      {
        name: '发起合同审批',
        content: '发起合同审批。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起得合同申请，并可对申请记录操作通过或拒绝。通过后，附件将自动上传到合同管理根目录里。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的合同审批记录。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '绩效报告',
    children: [
      {
        name: '填写绩效报告',
        content: '在此填写绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的绩效报告，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '绩效报告列表',
        content: '查看自己的绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '物品领用',
    children: [
      {
        name: '申请物品领用',
        content: '在此申请物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的物品领用，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '物品领用列表',
        content: '查看自己申请的物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '销售业绩',
    children: [
      {
        name: '填写销售业绩',
        content: '在此填写销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的销售业绩，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '销售业绩列表',
        content: '查看自己的销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '邀约到访',
    children: [
      {
        name: '申请物邀约到访',
        content: '在此申请邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的邀约到访，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '邀约到访列表',
        content: '查看自己申请的邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '数据汇报与统计',
    children: [
      {
        name: '编辑汇报模板',
        content: '需要下属部门提交汇报，要先设置提交的汇报模板，包括提交的数据项、提交周期、提交开始结束时间。',
        go: (self) => {
          self.$f7router.navigate('/report/selectdepartment');
        }
      },
      {
        name: '查看员工汇报内容',
        content: '默认显示最近三天的汇报记录。',
        go: (self) => {
          self.$f7router.navigate('/report/statistics/', {
            props: {
              which: 'tabStatistic'
            }
          });
        }
      },
      {
        name: '查看汇报统计',
        content: '可分周期查看公司或部门个人的汇总数和对应图表展示， 注：员工提交的汇报第二天才显示统计图表',
        go: (self) => {
          self.$f7router.navigate('/report/statistics/');
        }
      },
      {
        name: '填写汇报',
        content: '填写汇报',
        go: (self) => {
          self.$f7router.navigate('/office/submitreport/', {});
        }
      }
    ]
  },
  {
    name: '日报模块',
    children: [
      {
        name: '日报设置',
        content: '注：部门管理员只能为当前部门设定日报设置。',
        go: (self) => {
          self.$f7router.navigate('/office/journalset/', {
            props: {
              lastPage: '公司设置',
              navTitle: '日报设置',
              dataType: 'leaveType'
            }
          });
        }
      },
      {
        name: '查看下属日报',
        content: '查看下属日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalList/', {
            props: {
              which: true
            }
          });
        }
      },
      {
        name: '提交日报',
        content: '提交日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalmgr/', {});
        }
      }
    ]
  },
  {
    name: '考核结算',
    children: [
      {
        name: '考核结算',
        content: '此功能可查看员工的加分扣分情况，刚进入页面默认会显示直属员工的考核。',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonallist/');
        }
      },
      {
        name: '查看其他员工考核',
        content: '查看其他员工考核',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonal/', {
            props: {
              which: 'selectorPersonnelShow'
            }
          });
        }
      }
    ]
  },
  {
    name: '售后服务',
    children: [
      {
        name: '上门服务',
        content: '任何APP使用问题或功能建议，需要三帆外勤上门服务的，可预约上门服务。只需在预约页面填写好相关联系信息。打开位置：关于我们的服务协议下方。',
        go: (self) => {
          self.$f7router.navigate('/software/visitingService/');
        }
      }
    ]
  }
];

export const h_finance = [
  {
    name: '锁定三帆软件操作指引',
    children: [
      {
        name: '设置进程锁定',
        contentList: [
          {content: '我们APP若被系统进程自动关闭或者人为关闭后，将影响部分功能使用，例如：实时查岗、聊天信息提示，相关日报汇报推送等，需要设置手机进程白名单'},
          {content: '华为机的后台设置：设置——>电池——>启动管理——>找到三帆外勤，点击进出，把允许自启动，允许关联启动，允许后台启动三个选项都勾上再确定，就OK。'},
          {content: 'OPPO手机的后台设置：设置——>电池——>耗电保护或者应用速冻——>找到三帆外勤，并关闭即可。'},
          {content: '三星手机的后台设置：设置——>常规管理——>电池——>未监视的应用程序——>添加应用程序，选择三帆外勤。'},
          {content: '魅族手机的后台设置：设置——>应用管理——>已安装列表找到三帆外勤进入——>权限管理——>后台管理，点击选择允许后台运行。'},
          {content: '图文操作以小米为例：'},
          {content: '第一步： 打开设置，点击电量和性能' },
          {img: 'white_list_1.png'},
          {content: '第二步： 点击应用配置' },
          {img: 'white_list_2.png'},
          {content: '第三步： 点击三帆外勤' },
          {img: 'white_list_3.png'},
          {content: '第四步： 选择无限制' },
          {img: 'white_list_4.png'},
          {content: '第五步： 点击任务管理器按钮，弹出后台应用进程界面' },
          {img: 'white_list_5.png'},
          {content: '第六步： 长按三帆外勤，选择锁定' },
          {img: 'white_list_6.png'}
        ]
      },
      {
        name: '清理后台进程注意事项（重点）',
        remark: true,
        contentList: [
          {content: '如果不这样操作，进程可能会误删，导致实时查岗无法正常定位、聊天信息和所有消息推送无法收到。'},
          {content: '图文操作以华为为例：'},
          {content: '第一步： 打开后台进程' },
          {img: 'white_list_7.png'},
          {content: '第二步： 如果三帆外勤软件没有锁上，请点击锁上' },
          {img: 'white_list_8.png'},
          {content: '第三步： 当你需要清理后台进程的时候，记得一定不能点击三帆外勤软件右上角X按钮退出软件，而且点击垃圾桶清除非白名单的软件' },
          {img: 'white_list_9.png'},
        ]
      }
    ]
  },
  {
    name: '考勤模块',
    children: [
      {
        name: '考勤打卡',
        content: '在此页面的右上角打卡记录可查看公司员工的考勤打卡情况。',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/');
        }
      },
      {
        name: '考勤管理',
        content: '可查看公司员工对自己发起的加班、请假、出差、外出申请记录，并可操作批准或驳回。 ',
        go: (self) => {
          self.$f7router.navigate('/office/applicamgr/');
        }
      },
      {
        name: '加班、请假、出差、外出申请',
        content: '加班、请假、出差、外出申请',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/', {
            props: {
              which: 'fRightBottom'
            }
          });
        }
      }
    ]
  },
  {
    name: '轨迹查岗',
    children: [
      {
        name: '实时查岗',
        content: '超级管理员通过此功能可查看自己和选择查看公司所有员工的手机定位情况。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。',
        go: (self) => {
          self.$f7router.navigate('/office/position/');
        }
      },
      {
        name: '工作轨迹',
        content: '超级管理员通过此功能可查看自己和和选择查看公司所有员工的工作轨迹路线。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。 ',
        go: (self) => {
          self.$f7router.navigate('/office/trace/');
        }
      }
    ]
  },
  {
    name: '费用报销',
    children: [
      {
        name: '报销类型',
        content: '在员工操作报销申请之前，我们可以预设一些报销类型。 ',
        go: (self) => {
          self.$f7router.navigate('/setting/expense/', {
            props: {
              lastPage: '公司设置',
              navTitle: '报销类型',
              dataType: 'leaveType'
            }
          });
        }
      },
      {
        name: '申请报销',
        content: '在此可发起报销申请。',
        go: (self) => {
          self.$f7router.navigate('/office/expensebxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工对自己发起的报销申请，并可对报销记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '审批列表',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 5
            }
          });
        }
      }
    ]
  },
  {
    name: '通讯录',
    children: [
      {
        name: '通讯录',
        content: '此功能类似微信聊天可对公司员工发起聊天，通过信息按钮打开聊天窗口，可发送文字、表情、相片文件。并可通过电话按钮拨打电话。',
        go: (self) => {
          self.$f7router.navigate('/office/contacts/', {});
        }
      }
    ]
  },
  {
    name: '任务模块',
    children: [
      {
        name: '任务管理',
        content: '此功能可新建任务去执行。'
      },
      {
        name: '新建任务',
        content: '新建任务',
        go: (self) => {
          self.$f7router.navigate('/office/task/', {
            props: {userId: self.myProfile._id}
          });
        }
      },
      {
        name: '查看本人任务情况',
        content: '查看本人任务情况',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      },
      {
        name: '进行任务与完成任务',
        content: '可长按拖动自己的任务到进行中、完成或未完成。',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      }
    ]
  },
  {
    name: '客户模块',
    children: [
      {
        name: '查看新增的客户',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'clientToolBar'
            }
          });
        }
      },
      {
        name: '查看新增的商家',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'businessToolBar'
            }
          });
        }
      },
      {
        name: '新增客户、商家',
        content: '点击右下角加号按钮弹出的菜单即可进行新增操作。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'add'
            }
          });
        }
      },
      {
        name: '扫名片',
        content: '此功能可通过扫码名片方式增加客户或增加联系人。',
        go: (self) => {
          self.$f7router.navigate('/client/ocr/', {
            props: {
              which: true
            }
          });
        }
      }
    ]
  },
  {
    name: '拜访管理',
    children: [
      {
        name: '新建拜访任务',
        content: '拜访类型有走访、电话拜访。上级可分任务给自己，也可新建拜访任务给自己，以拜访客户为例（商家类似）',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'addVisit'
            }
          });
        }
      },
      {
        name: '查看我的拜访任务',
        content: '通过拜访管理的列表可查看本人的拜访任务',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'sListToolbar'
            }
          });
        }
      },
      {
        name: '完成拜访任务',
        content: '打开对应的任务，点击最下面的拜访打卡或电话拜访即可完成拜访，注意电话通话时间要按照通话时间设置，否则不予通过。'
      },
      {
        name: '查看拜访统计',
        content: '可查看周期范围内，个人总共拜访数量，包括电话拜访、走访客户数，可在拜访管理—统计页面这里查看。',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'statisticsToolbar'
            }
          });
        }
      }
    ]
  },
  {
    name: '通知公告',
    children: [
      {
        name: '查看已发布的公告',
        content: '注：只有超级管理员、行政、部门管理才有权限发布通告和删除通告。',
        go: (self) => {
          self.$f7router.navigate('/office/announcemgr/');
        }
      }
    ]
  },
  {
    name: '用车申请',
    children: [
      {
        name: '用车类型',
        content: '申请用车之前，我们先设置车型。',
        go: (self) => {
          self.$f7router.navigate('/setting/car/', {
            props: {
              lastPage: '公司设置',
              navTitle: '车辆类型'
            }
          });
        }
      },
      {
        name: '申请用车',
        content: '在此发起申请用车。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/apply/');
        }
      },
      {
        name: '用车审批',
        content: '查看员工向自己发起的用车申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用车列表',
        content: '查看我的用车申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/carList/');
        }
      }
    ]
  },
  {
    name: '用章申请',
    children: [
      {
        name: '用章类型',
        content: '申请用章之前，我们先设置印章类型。',
        go: (self) => {
          self.$f7router.navigate('/setting/seal/', {
            props: {
              lastPage: '公司设置',
              navTitle: '车辆类型'
            }
          });
        }
      },
      {
        name: '申请用章',
        content: '在此发起申请用章。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/apply/');
        }
      },
      {
        name: '用章审批',
        content: '查看员工向自己发起的用章申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用章列表',
        content: '查看我的用章申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/');
        }
      }
    ]
  },
  {
    name: '采购申请',
    children: [
      {
        name: '申请报销',
        content: '在此可发起报销申请。',
        go: (self) => {
          self.$f7router.navigate('/office/expensebxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工向自己发起的采购申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的采购记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的采购申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '付款申请',
    children: [
      {
        name: '付款方式',
        content: '在员工操作付款申请之前，我们可以预设一些付款方式。',
        go: (self) => {
          self.$f7router.navigate('/setting/paymenttype/', {
            props: {
              lastPage: '公司设置',
              navTitle: '付款方式'
            }
          });
        }
      },
      {
        name: '待我审批',
        content: '查看员工向自己发起的付款申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '合同审批',
    children: [
      {
        name: '发起合同审批',
        content: '发起合同审批。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起得合同申请，并可对申请记录操作通过或拒绝。通过后，附件将自动上传到合同管理根目录里。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的合同审批记录。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '绩效报告',
    children: [
      {
        name: '填写绩效报告',
        content: '在此填写绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的绩效报告，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '绩效报告列表',
        content: '查看自己的绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '物品领用',
    children: [
      {
        name: '申请物品领用',
        content: '在此申请物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的物品领用，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '物品领用列表',
        content: '查看自己申请的物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '销售业绩',
    children: [
      {
        name: '填写销售业绩',
        content: '在此填写销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的销售业绩，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '销售业绩列表',
        content: '查看自己的销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '邀约到访',
    children: [
      {
        name: '申请物邀约到访',
        content: '在此申请邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的邀约到访，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '邀约到访列表',
        content: '查看自己申请的邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '数据汇报',
    children: [
      {
        name: '填写汇报',
        content: '超级管理员或上级设定好了数据模板后，则可开始填写汇报',
        go: (self) => {
          self.$f7router.navigate('/office/submitreport/', {});
        }
      },
      {
        name: '查看汇报统计',
        content: '可分周期查看个人的汇报总数和对应图表展示，汇报列表显示自己的汇报记录',
        go: (self) => {
          self.$f7router.navigate('/report/statistics/');
        }
      }
    ]
  },
  {
    name: '日报模块',
    children: [
      {
        name: '提交日报',
        content: '提交日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalmgr/', {});
        }
      },
      {
        name: '查看日报',
        content: '查看日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalList/');
        }
      }
    ]
  },
  {
    name: '财务文件管理',
    children: [
      {
        name: '新建目录',
        content: '点击“+”按钮弹出的新建文件夹按钮，可新建文件夹。',
        go: (self) => {
          self.$f7router.navigate('/finance/docs/', {
            props: {title: '财务', root: 'financialdocs', which: 'choose_action'}
          });
        }
      },
      {
        name: '上传文件',
        content: '点击“+”按钮弹出的上传文件按钮，可把文件上传到当前目录中。 ',
        go: (self) => {
          self.$f7router.navigate('/finance/docs/', {
            props: {title: '财务', root: 'financialdocs', which: 'choose_action'}
          });
        }
      },
      {
        name: '下载文件',
        content: '点击文件右边的小圆点选定了文件后，根据下面弹出的选项选择下载即可。下载后的文件都存放在手机文件目录：hawkDownloads里。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/finance/docs/', {
            props: {title: '财务', root: 'financialdocs', which: 'select'}
          });
        }
      }
    ]
  },
  {
    name: '财务管理',
    children: [
      {
        name: '财务设置',
        content: '这里可为我们设定默认的三级审核人，设了在新建财务单据时可默认审核人，不设则每次提交要手动选择。注：每笔财务记录都需要经过三级审核流程，分别是：审核人、审批人、出纳人。发起的财务记录，都会在财务审批页面操作审批确定，三级都审核通过的记录才会汇入公司总账。 ',
        go: (self) => {
          self.$f7router.navigate('/setting/finance/', {
            props: {
              lastPage: '公司设置',
              navTitle: '财务设置',
              dataType: 'leaveType'
            }
          });
        }
      }
    ]
  },
  {
    name: '应收账款',
    children: [
      {
        name: '新建应收账款',
        content: '新建应收账款',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_new',
              name: '应收账款',
              shortname: '应收',
              reference: { code: 'YS' }
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_search',
              name: '应收账款',
              shortname: '应收',
              reference: { code: 'YS' }
            }
          });
        }
      },
      {
        name: '查看历史记录',
        content: '查看历史记录',
        go: (self) => {
          self.$f7router.navigate('/finance/receivable/', {
            props: {
              which: 'selectMonth'
            }
          });
        }
      }
    ]
  },
  {
    name: '应付账款',
    children: [
      {
        name: '新建应付账款',
        content: '新建应付账款',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_new',
              name: '应付账款',
              shortname: '应付',
              reference: { code: 'YF' }
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_search',
              name: '应付账款',
              shortname: '应付',
              reference: { code: 'YF' }
            }
          });
        }
      },
      {
        name: '查看历史记录',
        content: '查看历史记录',
        go: (self) => {
          self.$f7router.navigate('/finance/payable/', {
            props: {
              which: 'selectMonth'
            }
          });
        }
      }
    ]
  },
  {
    name: '固定支出',
    children: [
      {
        name: '新建固定支出',
        content: '新建固定支出',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_new',
              name: '固定支出',
              shortname: '支出',
              reference: { code: 'GZ' }
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/transaction/', {
            props: {
              contextType: '_search',
              name: '固定支出',
              shortname: '支出',
              reference: { code: 'GZ' }
            }
          });
        }
      },
      {
        name: '查看历史记录',
        content: '查看历史记录',
        go: (self) => {
          self.$f7router.navigate('/finance/fixedCost/', {
            props: {
              which: 'selectMonth'
            }
          });
        }
      }
    ]
  },
  {
    name: '财务录入',
    children: [
      {
        name: '新建财务录入',
        content: '新建财务录入',
        go: (self) => {
          self.$f7router.navigate('/finance/entry/', {
            props: {
              which: 'add'
            }
          });
        }
      },
      {
        name: '搜索查看记录',
        content: '搜索查看记录',
        go: (self) => {
          self.$f7router.navigate('/finance/entry/', {
            props: {
              which: 'search'
            }
          });
        }
      }
    ]
  },
  {
    name: '财务审批',
    children: [
      {
        name: '财务审批',
        content: '此功能可对所有财务板块对本人发起的审批记录操作通过或驳回。',
        go: (self) => {
          self.$f7router.navigate('/finance/auditlist/');
        }
      }
    ]
  },
  {
    name: '公司总账',
    children: [
      {
        name: '公司总账',
        content: '此窗口可查看当日收入、支出及结存余额。收入列表、支出列表进入可查看对应的收支记录。详细搜索功能与上类似。',
        go: (self) => {
          self.$f7router.navigate('/finance/ledger/');
        }
      }
    ]
  },
  {
    name: '考核结算',
    children: [
      {
        name: '考核结算',
        content: '查看个人考核',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonal/', {});
        }
      }
    ]
  },
  {
    name: '售后服务',
    children: [
      {
        name: '上门服务',
        content: '任何APP使用问题或功能建议，需要三帆外勤上门服务的，可预约上门服务。只需在预约页面填写好相关联系信息。打开位置：关于我们的服务协议下方。',
        go: (self) => {
          self.$f7router.navigate('/software/visitingService/');
        }
      }
    ]
  }
];

export const h_administration = [
  {
    name: '锁定三帆软件操作指引',
    children: [
      {
        name: '设置进程锁定',
        contentList: [
          {content: '我们APP若被系统进程自动关闭或者人为关闭后，将影响部分功能使用，例如：实时查岗、聊天信息提示，相关日报汇报推送等，需要设置手机进程白名单'},
          {content: '华为机的后台设置：设置——>电池——>启动管理——>找到三帆外勤，点击进出，把允许自启动，允许关联启动，允许后台启动三个选项都勾上再确定，就OK。'},
          {content: 'OPPO手机的后台设置：设置——>电池——>耗电保护或者应用速冻——>找到三帆外勤，并关闭即可。'},
          {content: '三星手机的后台设置：设置——>常规管理——>电池——>未监视的应用程序——>添加应用程序，选择三帆外勤。'},
          {content: '魅族手机的后台设置：设置——>应用管理——>已安装列表找到三帆外勤进入——>权限管理——>后台管理，点击选择允许后台运行。'},
          {content: '图文操作以小米为例：'},
          {content: '第一步： 打开设置，点击电量和性能' },
          {img: 'white_list_1.png'},
          {content: '第二步： 点击应用配置' },
          {img: 'white_list_2.png'},
          {content: '第三步： 点击三帆外勤' },
          {img: 'white_list_3.png'},
          {content: '第四步： 选择无限制' },
          {img: 'white_list_4.png'},
          {content: '第五步： 点击任务管理器按钮，弹出后台应用进程界面' },
          {img: 'white_list_5.png'},
          {content: '第六步： 长按三帆外勤，选择锁定' },
          {img: 'white_list_6.png'}
        ]
      },
      {
        name: '清理后台进程注意事项（重点）',
        remark: true,
        contentList: [
          {content: '如果不这样操作，进程可能会误删，导致实时查岗无法正常定位、聊天信息和所有消息推送无法收到。'},
          {content: '图文操作以华为为例：'},
          {content: '第一步： 打开后台进程' },
          {img: 'white_list_7.png'},
          {content: '第二步： 如果三帆外勤软件没有锁上，请点击锁上' },
          {img: 'white_list_8.png'},
          {content: '第三步： 当你需要清理后台进程的时候，记得一定不能点击三帆外勤软件右上角X按钮退出软件，而且点击垃圾桶清除非白名单的软件' },
          {img: 'white_list_9.png'},
        ]
      }
    ]
  },
  {
    name: '企业基本设置',
    children: [
      {
        name: '职位类型',
        content: '通过编辑按钮和新增按钮可编译我们的职位信息，便于新增员工时指定其职位。',
        go: (self) => {
          self.$f7router.navigate('/setting/meta/',
            {
              props: {
                lastPage: '公司设置',
                navTitle: '职位类型',
                dataType: 'jobType'
              }
            }
          );
        }
      },
      {
        name: '组织架构',
        content: '此功能可为我们新增部门和员工，通过底部的添加部门和添加员工操作，并且部门允许设置多级子部门，操作顺序：先添加部门，再添加员工。接下来我们来操作新增部门和员工。',
        go: (self) => {
          self.$f7router.navigate('/office/organization');
        }
      },
      {
        name: '节假日设置',
        content: '公司临时放假或者国假日放假，可在此设置节假日，设置了节假日的天数，将不用打考勤。',
        go: (self) => {
          self.$f7router.navigate('/setting/holiday/', {
            props: {
              lastPage: '公司设置'
            }
          });
        }
      }
    ]
  },
  {
    name: '考勤模块',
    children: [
      {
        name: '考勤设置',
        content: '考勤分两个类型：上下班、实时打卡。实时打卡属于外勤打卡，可不限地点；上下班打卡则固定打卡地点。通过考勤组页面的新增考勤组按钮添加，接下来我们来操作新增考勤组。',
        go: (self) => {
          self.$f7router.navigate('/setting/company/timecards', {
            props: {
              lastPage: '公司设置'
            }
          });
        }
      },
      {
        name: '考勤打卡',
        content: '在我的考勤此页面点击红色打卡按钮即可进行打卡。 ',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/', {
            props: {
              which: 'checkin'
            }
          });
        }
      },
      {
        name: '加班、请假、出差、外出申请',
        content: '加班、请假、出差、外出申请',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/', {
            props: {
              which: 'fRightBottom'
            }
          });
        }
      },
      {
        name: '考勤管理',
        content: '可查看自发起的加班、请假、出差、外出申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/applicamgr/', {
            props: {
              status: 1
            }
          });
        }
      },
      {
        name: '考勤审批',
        content: '查看其他员工提交的加班、请假、出差、外出申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/applicamgr/', {
            props: {
              status: 0
            }
          });
        }
      }
    ]
  },
  {
    name: '轨迹查岗',
    children: [
      {
        name: '实时查岗',
        content: '超级管理员通过此功能可查看自己和选择查看公司所有员工的手机定位情况。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。',
        go: (self) => {
          self.$f7router.navigate('/office/position/');
        }
      },
      {
        name: '工作轨迹',
        content: '超级管理员通过此功能可查看自己和和选择查看公司所有员工的工作轨迹路线。提示说明：上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。',
        go: (self) => {
          self.$f7router.navigate('/office/trace/');
        }
      }
    ]
  },
  {
    name: '费用报销',
    children: [
      {
        name: '申请报销',
        content: '在此可发起报销申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/expensebxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工对自己发起的报销申请，并可对报销记录操作通过或拒绝。 ',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '已审批列表',
        content: '已审批列表',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 5
            }
          });
        }
      }
    ]
  },
  {
    name: '通讯录',
    children: [
      {
        name: '通讯录',
        content: '此功能类似微信聊天可对公司员工发起聊天，通过信息按钮打开聊天窗口，可发送文字、表情、相片文件。并可通过电话按钮拨打电话。',
        go: (self) => {
          self.$f7router.navigate('/office/contacts/', {});
        }
      }
    ]
  },
  {
    name: '任务模块',
    children: [
      {
        name: '任务管理',
        content: '此功能可新建任务去执行。'
      },
      {
        name: '新建任务',
        content: '新建任务',
        go: (self) => {
          self.$f7router.navigate('/office/task/', {
            props: {userId: self.myProfile._id}
          });
        }
      },
      {
        name: '查看本人任务情况',
        content: '查看本人任务情况',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      },
      {
        name: '进行任务与完成任务',
        content: '可长按拖动自己的任务到进行中、完成或未完成。 ',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      }
    ]
  },
  {
    name: '客户模块',
    children: [
      {
        name: '查看新增的客户',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'clientToolBar'
            }
          });
        }
      },
      {
        name: '查看新增的商家',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'businessToolBar'
            }
          });
        }
      },
      {
        name: '新增客户、商家',
        content: '点击右下角加号按钮弹出的菜单即可进行新增操作。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'add'
            }
          });
        }
      },
      {
        name: '扫名片',
        content: '此功能可通过扫码名片方式增加客户或增加联系人。',
        go: (self) => {
          self.$f7router.navigate('/client/ocr/', {
            props: {
              which: true
            }
          });
        }
      }
    ]
  },
  {
    name: '拜访管理',
    children: [
      {
        name: '新建拜访任务',
        content: '拜访类型有走访、电话拜访。上级可分任务给自己，也可新建拜访任务给自己，以拜访客户为例（商家类似）  ',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'addVisit'
            }
          });
        }
      },
      {
        name: '查看我的拜访任务',
        content: '通过拜访管理的列表可查看本人的拜访任务 ',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'sListToolbar'
            }
          });
        }
      },
      {
        name: '完成拜访任务',
        content: '打开对应的任务，点击最下面的拜访打卡或电话拜访即可完成拜访，注意电话通话时间要按照通话时间设置，否则不予通过。'
      },
      {
        name: '查看拜访统计',
        content: '可查看周期范围内，个人总共拜访数量，包括电话拜访、走访客户数，可在拜访管理—统计页面这里查看。',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'statisticsToolbar'
            }
          });
        }
      }
    ]
  },
  {
    name: '通知公告',
    children: [
      {
        name: '发布通知',
        content: '通过发布通知内容可通知相关人员，接下来我们创建一个公告',
        go: (self) => {
          self.$f7router.navigate('/office/announce/');
        }
      },
      {
        name: '查看已发布的公告',
        content: '注：只有超级管理员、行政、部门管理才有权限发布通告和删除通告。',
        go: (self) => {
          self.$f7router.navigate('/office/announcemgr/');
        }
      }
    ]
  },
  {
    name: '用车申请',
    children: [
      {
        name: '用车类型',
        content: '申请用车之前，我们先设置车型。',
        go: (self) => {
          self.$f7router.navigate('/setting/car/', {
            props: {
              lastPage: '公司设置',
              navTitle: '车辆类型'
            }
          });
        }
      },
      {
        name: '申请用车',
        content: '在此发起申请用车。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/apply/');
        }
      },
      {
        name: '用车审批',
        content: '查看员工向自己发起的用车申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用车列表',
        content: '查看我的用车申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/carList/');
        }
      }
    ]
  },
  {
    name: '用章申请',
    children: [
      {
        name: '用章类型',
        content: '申请用章之前，我们先设置印章类型。',
        go: (self) => {
          self.$f7router.navigate('/setting/seal/', {
            props: {
              lastPage: '公司设置',
              navTitle: '车辆类型'
            }
          });
        }
      },
      {
        name: '申请用章',
        content: '在此发起申请用章。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/apply/');
        }
      },
      {
        name: '用章审批',
        content: '查看员工向自己发起的用章申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '用章列表',
        content: '查看我的用章申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/');
        }
      }
    ]
  },
  {
    name: '采购申请',
    children: [
      {
        name: '申请报销',
        content: '在此可发起报销申请。',
        go: (self) => {
          self.$f7router.navigate('/office/expensebxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工向自己发起的采购申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的采购记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的采购申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '付款申请',
    children: [
      {
        name: '付款方式',
        content: '在员工操作付款申请之前，我们可以预设一些付款方式。',
        go: (self) => {
          self.$f7router.navigate('/setting/paymenttype/', {
            props: {
              lastPage: '公司设置',
              navTitle: '付款方式'
            }
          });
        }
      },
      {
        name: '付款申请',
        content: '在此可发起付款申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/paymentbxmgr/');
        }
      },
      {
        name: '待我审批',
        content: '查看员工向自己发起的付款申请，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 4
            }
          });
        }
      },
      {
        name: '审批列表',
        content: '查看已审批完成的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 5
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的付款申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '合同审批',
    children: [
      {
        name: '发起合同审批',
        content: '发起合同审批。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起得合同申请，并可对申请记录操作通过或拒绝。通过后，附件将自动上传到合同管理根目录里。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '发起列表',
        content: '查看自己提交的合同审批记录。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '绩效报告',
    children: [
      {
        name: '填写绩效报告',
        content: '在此填写绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的绩效报告，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '绩效报告列表',
        content: '查看自己的绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '物品领用',
    children: [
      {
        name: '申请物品领用',
        content: '在此申请物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的物品领用，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '物品领用列表',
        content: '查看自己申请的物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '销售业绩',
    children: [
      {
        name: '填写销售业绩',
        content: '在此填写销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的销售业绩，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '销售业绩列表',
        content: '查看自己的销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '邀约到访',
    children: [
      {
        name: '申请物邀约到访',
        content: '在此申请邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/apply/');
        }
      },
      {
        name: '审批列表',
        content: '查看员工向自己发起的邀约到访，并可对申请记录操作通过或拒绝。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 1
            }
          });
        }
      },
      {
        name: '邀约到访列表',
        content: '查看自己申请的邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '数据汇报',
    children: [
      {
        name: '填写汇报',
        content: '超级管理员或上级设定好了数据模板后，则可开始填写汇报',
        go: (self) => {
          self.$f7router.navigate('/office/submitreport/', {});
        }
      },
      {
        name: '查看汇报统计',
        content: '可分周期查看个人的汇报总数和对应图表展示，汇报列表显示自己的汇报记录',
        go: (self) => {
          self.$f7router.navigate('/report/statistics/');
        }
      }
    ]
  },
  {
    name: '日报模块',
    children: [
      {
        name: '提交日报',
        content: '提交日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalmgr/', {});
        }
      },
      {
        name: '查看日报',
        content: '查看日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalList/');
        }
      }
    ]
  },
  {
    name: '合同文件管理',
    children: [
      {
        name: '新建目录',
        content: '点击“+”按钮弹出的新建文件夹按钮，可新建文件夹。',
        go: (self) => {
          self.$f7router.navigate('/office/contracts/', {
            props: {title: '合同', root: 'contracts', which: 'choose_action'}
          });
        }
      },
      {
        name: '上传文件',
        content: '点击“+”按钮弹出的上传文件按钮，可把文件上传到当前目录中。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/office/contracts/', {
            props: {title: '合同', root: 'contracts', which: 'choose_action'}
          });
        }
      },
      {
        name: '下载文件',
        content: '点击文件右边的小圆点选定了文件后，根据下面弹出的选项选择下载即可。下载后的文件都存放在手机文件目录：hawkDownloads里。注：苹果手机只支持上传图片，而安卓手机可上传任意文件。',
        go: (self) => {
          self.$f7router.navigate('/office/contracts/', {
            props: {title: '合同', root: 'contracts', which: 'select'}
          });
        }
      }
    ]
  },
  {
    name: '考核设置',
    children: [
      {
        name: '薪资录入',
        content: '在设置考核之前，我们先设置员工的薪资。（一元等同于一分）',
        go: (self) => {
          self.$f7router.navigate('/finance/salary/');
        }
      },
      {
        name: '考勤考核',
        content: '可对员工设置迟到早退漏卡等的扣分，考核设置还包括开始结束时间、执行人。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'attendance',pageName:'考勤'}
          });
        }
      },
      {
        name: '日报考核',
        content: '可对员工设置不交日报的扣分。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'daily',pageName:'日报'}
          });
        }
      },
      {
        name: '拜访考核',
        content: '可对员工未完成拜访扣分和完成后加分，可分周期日、周、月设定，包括走访、电访数设置。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'visit',pageName:'拜访'}
          });
        }
      },
      {
        name: '任务考核',
        content: '可对员工设置完成任务的加分与未完成任务的扣分。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'task',pageName:'任务'}
          });
        }
      },
      {
        name: '汇报考核',
        content: '可对员工设置不交汇报的扣分。其中的模板考核设置项意思是对应前面汇报模板中的考核达标项，达到加多少，未达到扣多少，可分多档位设定。',
        img: 'pic_operational_guideline@2x.png',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'report',pageName:'汇报'}
          });
        }
      },
      {
        name: '自定义加减',
        content: '可直接对员工操作加分或减分，可用于临时奖励或惩罚。',
        go: (self) => {
          self.$f7router.navigate('/office/scorelist/', {
            props: {ruleModule:'custom',pageName:'自定义'}
          });
        }
      }
    ]
  },
  {
    name: '考核结算',
    children: [
      {
        name: '查看员工考核',
        content: '刚进入页面默认会显示直属员工的考核。',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonallist/');
        }
      },
      {
        name: '查看其他员工考核',
        content: '查看其他员工考核',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonal/', {
            props: {
              which: 'selectorPersonnelShow'
            }
          });
        }
      }
    ]
  },
  {
    name: '售后服务',
    children: [
      {
        name: '上门服务',
        content: '任何APP使用问题或功能建议，需要三帆外勤上门服务的，可预约上门服务。只需在预约页面填写好相关联系信息。打开位置：关于我们的服务协议下方。',
        go: (self) => {
          self.$f7router.navigate('/software/visitingService/');
        }
      }
    ]
  }
];

export const h_employee = [
  {
    name: '锁定三帆软件操作指引',
    children: [
      {
        name: '设置进程锁定',
        contentList: [
          {content: '我们APP若被系统进程自动关闭或者人为关闭后，将影响部分功能使用，例如：实时查岗、聊天信息提示，相关日报汇报推送等，需要设置手机进程白名单'},
          {content: '华为机的后台设置：设置——>电池——>启动管理——>找到三帆外勤，点击进出，把允许自启动，允许关联启动，允许后台启动三个选项都勾上再确定，就OK。'},
          {content: 'OPPO手机的后台设置：设置——>电池——>耗电保护或者应用速冻——>找到三帆外勤，并关闭即可。'},
          {content: '三星手机的后台设置：设置——>常规管理——>电池——>未监视的应用程序——>添加应用程序，选择三帆外勤。'},
          {content: '魅族手机的后台设置：设置——>应用管理——>已安装列表找到三帆外勤进入——>权限管理——>后台管理，点击选择允许后台运行。'},
          {content: '图文操作以小米为例：'},
          {content: '第一步： 打开设置，点击电量和性能' },
          {img: 'white_list_1.png'},
          {content: '第二步： 点击应用配置' },
          {img: 'white_list_2.png'},
          {content: '第三步： 点击三帆外勤' },
          {img: 'white_list_3.png'},
          {content: '第四步： 选择无限制' },
          {img: 'white_list_4.png'},
          {content: '第五步： 点击任务管理器按钮，弹出后台应用进程界面' },
          {img: 'white_list_5.png'},
          {content: '第六步： 长按三帆外勤，选择锁定' },
          {img: 'white_list_6.png'}
        ]
      },
      {
        name: '清理后台进程注意事项（重点）',
        remark: true,
        contentList: [
          {content: '如果不这样操作，进程可能会误删，导致实时查岗无法正常定位、聊天信息和所有消息推送无法收到。'},
          {content: '图文操作以华为为例：'},
          {content: '第一步： 打开后台进程' },
          {img: 'white_list_7.png'},
          {content: '第二步： 如果三帆外勤软件没有锁上，请点击锁上' },
          {img: 'white_list_8.png'},
          {content: '第三步： 当你需要清理后台进程的时候，记得一定不能点击三帆外勤软件右上角X按钮退出软件，而且点击垃圾桶清除非白名单的软件' },
          {img: 'white_list_9.png'},
        ]
      }
    ]
  },
  {
    name: '考勤模块',
    children: [
      {
        name: '我的考勤',
        content: '在此页面点击红色打卡按钮即可进行打卡。 ',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/', {
            props: {
              which: 'checkin'
            }
          });
        }
      },
      {
        name: '加班、请假、出差、外出申请',
        content: '加班、请假、出差、外出申请',
        go: (self) => {
          self.$f7router.navigate('/office/checkin/', {
            props: {
              which: 'fRightBottom'
            }
          });
        }
      },
      {
        name: '考勤管理',
        content: '可查看自发起的加班、请假、出差、外出申请记录。',
        go: (self) => {
          self.$f7router.navigate('/office/applicamgr/', {
            props: {
              status: 1
            }
          });
        }
      }
    ]
  },
  {
    name: '轨迹查岗',
    children: [
      {
        name: '实时查岗',
        content: '可查看自己的定位情况。',
        go: (self) => {
          self.$f7router.navigate('/office/position/');
        }
      },
      {
        name: '工作轨迹',
        content: '可查看自己的工作轨迹路线。',
        go: (self) => {
          self.$f7router.navigate('/office/trace/');
        }
      },
      {
        name: '提示说明',
        content: '上级可以查看下级，下级看不了上级，平级不能互相查看，不同部门之间不能互相查看。'
      }
    ]
  },
  {
    name: '费用报销',
    children: [
      {
        name: '申请报销',
        content: '在此可发起报销申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/expensebxmgr/');
        }
      },
      {
        name: '查看发起列表',
        content: '查看发起列表',
        go: (self) => {
          self.$f7router.navigate('/office/expenseList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '通讯录',
    children: [
      {
        name: '通讯录',
        content: '此功能类似微信聊天可对公司员工发起聊天，通过信息按钮打开聊天窗口，可发送文字、表情、相片文件。并可通过电话按钮拨打电话。',
        go: (self) => {
          self.$f7router.navigate('/office/contacts/');
        }
      }
    ]
  },
  {
    name: '任务模块',
    children: [
      {
        name: '任务管理',
        content: '此功能可新建任务去执行。'
      },
      {
        name: '新建任务',
        content: '新建任务',
        go: (self) => {
          self.$f7router.navigate('/office/task/', {
            props: {userId: self.myProfile._id}
          });
        }
      },
      {
        name: '查看本人任务情况',
        content: '查看本人任务情况',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      },
      {
        name: '进行任务与完成任务',
        content: '可长按拖动自己的任务到进行中、完成或未完成。',
        go: (self) => {
          self.$f7router.navigate('/office/taskindex/', {
            props: {
              which: 'self'
            }
          });
        }
      }
    ]
  },
  {
    name: '客户模块',
    children: [
      {
        name: '查看新增的客户',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'clientToolBar'
            }
          });
        }
      },
      {
        name: '查看新增的商家',
        content: '规则：上级可查看下级公有和私有的客户/商家，同级私有不可见，公有可见，下级查看不了上级的客户/商家。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'businessToolBar'
            }
          });
        }
      },
      {
        name: '新增客户、商家',
        content: '点击右下角加号按钮弹出的菜单即可进行新增操作。',
        go: (self) => {
          self.$f7router.navigate('/client/clientmgr/', {
            props: {
              which: 'add'
            }
          });
        }
      },
      {
        name: '扫名片',
        content: '此功能可通过扫码名片方式增加客户或增加联系人。',
        go: (self) => {
          self.$f7router.navigate('/client/ocr/', {
            props: {
              which: true
            }
          });
        }
      }
    ]
  },
  {
    name: '拜访管理',
    children: [
      {
        name: '新建拜访任务',
        content: '拜访类型有走访、电话拜访。上级可分任务给自己，也可新建拜访任务给自己，以拜访客户为例（商家类似） ',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'addVisit'
            }
          });
        }
      },
      {
        name: '查看我的拜访任务',
        content: '通过拜访管理的列表可查看本人的拜访任务',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'sListToolbar'
            }
          });
        }
      },
      {
        name: '完成拜访任务',
        content: '打开对应的任务，点击最下面的拜访打卡或电话拜访即可完成拜访，注意电话通话时间要按照通话时间设置，否则不予通过。'
      },
      {
        name: '查看拜访统计',
        content: '可查看周期范围内，个人总共拜访数量，包括电话拜访、走访客户数，可在拜访管理—统计页面这里查看。',
        go: (self) => {
          self.$f7router.navigate('/client/visitmgr/', {
            props: {
              which: 'statisticsToolbar'
            }
          });
        }
      }
    ]
  },
  {
    name: '通知公告',
    children: [
      {
        name: '查看已发布的公告',
        content: '注：只有超级管理员、行政、部门管理才有权限发布通告和删除通告。',
        go: (self) => {
          self.$f7router.navigate('/office/announcemgr/');
        }
      }
    ]
  },
  {
    name: '用车申请',
    children: [
      {
        name: '申请用车',
        content: '在此发起申请用车。',
        go: (self) => {
          self.$f7router.navigate('/office/carList/apply/');
        }
      },
      {
        name: '用车列表',
        content: '查看我的用车申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/carList/');
        }
      }
    ]
  },
  {
    name: '用章申请',
    children: [
      {
        name: '申请用章',
        content: '在此发起申请用章。',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/apply/');
        }
      },
      {
        name: '用章列表',
        content: '查看我的用章申请列表',
        go: (self) => {
          self.$f7router.navigate('/office/sealList/');
        }
      }
    ]
  },
  {
    name: '采购申请',
    children: [
      {
        name: '采购申请',
        content: '在此可发起采购申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/procurementbxmgr/');
        }
      },
      {
        name: '查看发起列表',
        content: '查看发起列表',
        go: (self) => {
          self.$f7router.navigate('/office/procurementList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '付款申请',
    children: [
      {
        name: '付款申请',
        content: '在此可发起付款申请。 ',
        go: (self) => {
          self.$f7router.navigate('/office/paymentbxmgr/');
        }
      },
      {
        name: '查看发起列表',
        content: '查看发起列表',
        go: (self) => {
          self.$f7router.navigate('/office/paymentList/', {
            props: {
              which: 2
            }
          });
        }
      }
    ]
  },
  {
    name: '合同审批',
    children: [
      {
        name: '发起合同审批',
        content: '发起合同审批。',
        go: (self) => {
          self.$f7router.navigate('/office/contractList/apply/');
        }
      }
    ]
  },
  {
    name: '绩效报告',
    children: [
      {
        name: '填写绩效报告',
        content: '在此填写绩效报告。',
        go: (self) => {
          self.$f7router.navigate('/office/performanceList/apply/');
        }
      }
    ]
  },
  {
    name: '物品领用',
    children: [
      {
        name: '申请物品领用',
        content: '在此申请物品领用。',
        go: (self) => {
          self.$f7router.navigate('/office/goodsList/apply/');
        }
      }
    ]
  },
  {
    name: '销售业绩',
    children: [
      {
        name: '填写销售业绩',
        content: '在此填写销售业绩。',
        go: (self) => {
          self.$f7router.navigate('/office/salesmanageList/apply/');
        }
      }
    ]
  },
  {
    name: '邀约到访',
    children: [
      {
        name: '申请物邀约到访',
        content: '在此申请邀约到访。',
        go: (self) => {
          self.$f7router.navigate('/client/invitationList/apply/');
        }
      }
    ]
  },
  {
    name: '数据汇报',
    children: [
      {
        name: '填写汇报',
        content: '超级管理员或上级设定好了数据模板后，则可开始填写汇报 ',
        go: (self) => {
          self.$f7router.navigate('/office/submitreport/', {});
        }
      },
      {
        name: '查看汇报统计',
        content: '可分周期查看个人的汇报总数和对应图表展示，汇报列表显示自己的汇报记录 ',
        go: (self) => {
          self.$f7router.navigate('/report/statistics/');
        }
      }
    ]
  },
  {
    name: '日报模块',
    children: [
      {
        name: '提交日报',
        content: '提交日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalmgr/', {});
        }
      },
      {
        name: '查看日报',
        content: '查看日报',
        go: (self) => {
          self.$f7router.navigate('/office/journalList/');
        }
      }
    ]
  },
  {
    name: '考核结算',
    children: [
      {
        name: '查看个人考核',
        content: '查看个人考核',
        go: (self) => {
          self.$f7router.navigate('/office/scorepersonal/', {});
        }
      }
    ]
  },
  {
    name: '售后服务',
    children: [
      {
        name: '上门服务',
        content: '任何APP使用问题或功能建议，需要三帆外勤上门服务的，可预约上门服务。只需在预约页面填写好相关联系信息。打开位置：关于我们的服务协议下方。',
        go: (self) => {
          self.$f7router.navigate('/software/visitingService/');
        }
      }
    ]
  }
];

export default {
  h_superAdmin,
  h_department,
  h_finance,
  h_administration,
  h_employee
};
