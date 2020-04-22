let toHomeing = false; //首页跳转标志 规定时间内只能执行一次跳转
const routes = [

  // landing pages
  {
    path: '/',
    component: require('./components/frame.vue')
    // beforeEnter: function (routeTo, routeFrom, resolve, reject) {
    //
    //   if (toHomeing) {
    //     return reject();
    //   }
    //   toHomeing = true
    //   const tt = setTimeout(() => {
    //     toHomeing = false;
    //     clearTimeout(tt);
    //   }, 1000);
    //
    //   console.log('返回路由跳转', routeTo.url, routeFrom.url);
    //   if (routeFrom.url == '/' && routeTo.url == '/') {
    //     reject();
    //   } else {
    //     resolve();
    //   }
    // }
  },
  {
    path: '/home/',
    component: require('./components/home.vue')
  },
  {
    path: '/login/',
    component: require('./components/auth/login.vue'),
    options: {reloadAll: true}
  },
  {
    path: '/registrate/',
    component: require('./components/auth/registrate.vue')
  },

  // charts
  {
    path: '/chart/mystats/',
    component: require('./components/chart/mystats.vue')
  },

  // views
  {
    path: '/preference/',
    component: require('./components/preference.vue')
  },
  {
    path: '/message/',
    component: require('./components/message.vue')
  },
  {
    path: '/statistic/',
    component: require('./components/statistic.vue')
  },

  // office
  {
    path: '/office/trace/',
    component: require('./components/office/trace.vue')
  },
  {
    path: '/office/position/',
    component: require('./components/office/position.vue')
  },
  {
    path: '/office/task/',
    component: require('./components/office/task.vue')
  },
  {
    path: '/office/taskdetail/',
    component: require('./components/office/taskdetail.vue')
  },
  {
    path: '/office/taskmanager/',
    component: require('./components/office/taskmanager.vue')
  },
  {
    path: '/office/taskself/',
    component: require('./components/office/taskself.vue')
  },
  {
    path: '/office/taskstaff/',
    component: require('./components/office/taskstaff.vue')
  },
  {
    path: '/office/taskindex/',
    component: require('./components/office/taskindex.vue')
  },
  {
    path: '/office/tasklist/',
    component: require('./components/office/tasklist.vue')
  },
  {
    path: '/office/tasksearch/',
    component: require('./components/office/tasksearch.vue')
  },
  {
    path: '/office/announce/',
    component: require('./components/office/announce.vue')
  },
  {
    path: '/office/announcemgr/',
    component: require('./components/office/announcemgr.vue')
  },
  {
    path: '/office/report/',
    component: require('./components/office/report.vue')
  },
  {
    path: '/office/submitreport/',
    component: require('./components/office/submitreport.vue')
  },
  {
    path: '/office/reportmgr/',
    component: require('./components/office/reportmgr.vue')
  },
  {
    path: '/office/contacts/',
    component: require('./components/office/contacts.vue')
  },
  {
    path: '/office/expensemgr/',
    component: require('./components/office/expensemgr.vue')
  },
  {
    path: '/office/paymentmgr/',
    component: require('./components/office/paymentmgr.vue')
  },
  {
    path: '/office/procurementmgr/',
    component: require('./components/office/procurementmgr.vue')
  },
  {
    path: '/office/applicamgr/',
    component: require('./components/office/applicamgr.vue')
  },
  {
    path: '/office/checkin/',
    component: require('./components/office/checkin.vue')
  },
  {
    path: '/office/timerecord/',
    component: require('./components/office/timerecord.vue')
  },
  {
    path: '/office/leave/',
    component: require('./components/office/leave.vue')
  },
  {
    path: '/office/travel/',
    component: require('./components/office/travel.vue')
  },
  {
    path: '/office/overtime/',
    component: require('./components/office/overtime.vue')
  },
  {
    path: '/office/goOut/',
    component: require('./components/office/goOut.vue')
  },
  {
    path: '/office/expense/',
    component: require('./components/office/expense.vue')
  },
  {
    path: '/office/expensebxmgr/',
    component: require('./components/office/expensebxmgr.vue')
  },
  {
    path: '/office/expensedateil/',
    component: require('./components/office/expensedateil.vue')
  },
  {
    path: '/office/expenseList/',
    component: require('./components/office/expenseList.vue')
  },
  {
    path: '/office/procurement/',
    component: require('./components/office/procurement.vue')
  },
  {
    path: '/office/procurementbxmgr/',
    component: require('./components/office/procurementbxmgr.vue')
  },
  {
    path: '/office/procurementdateil/',
    component: require('./components/office/procurementdateil.vue')
  },
  {
    path: '/office/procurementList/',
    component: require('./components/office/procurementList.vue')
  },
  {
    path: '/office/senderdateil/',
    component: require('./components/office/senderdateil.vue')
  },
  {
    path: '/office/payment/',
    component: require('./components/office/payment.vue')
  },
  {
    path: '/office/paymentbxmgr/',
    component: require('./components/office/paymentbxmgr.vue')
  },
  {
    path: '/office/paymentdateil/',
    component: require('./components/office/paymentdateil.vue')
  },
  {
    path: '/office/paymentList/',
    component: require('./components/office/paymentList.vue')
  },
  {
    path: '/office/journaldetail/',
    component: require('./components/office/journaldetail.vue')
  },
  {
    path: '/office/journalList/',
    component: require('./components/office/journalList.vue')
  },
  {
    path: '/office/journalmgr/',
    component: require('./components/office/journalmgr.vue')
  },
  {
    path: '/office/scoremgr/',
    component: require('./components/office/scoremgr.vue')
  },
  {
    path: '/office/scorelist/',
    component: require('./components/office/scorelist.vue')
  },
  {
    path: '/office/scorepersonal/',
    component: require('./components/office/scorepersonal.vue')
  },
  {
    path: '/office/scorepersonallist/',
    component: require('./components/office/scorepersonallist.vue')
  },
  {
    path: '/office/scoredetails/',
    component: require('./components/office/scoredetails.vue')
  },
  {
    path: '/office/journalset/',
    component: require('./components/office/journalset.vue')
  },

  {
    path: '/office/privilege/',
    component: require('./components/office/privilege.vue'),
  },
  {
    path: '/office/privilegeadmin/',
    component: require('./components/office/privilegeadmin.vue'),
  },
  {
    path: '/office/privilegefinance/',
    component: require('./components/office/privilegefinance.vue'),
  },
  {
    path: '/office/privilegeadministrative/',
    component: require('./components/office/privilegeadministrative.vue'),
  },
  {
    path: '/office/privilegesuperadmin/',
    component: require('./components/office/privilegesuperadmin.vue'),
  },
  {
    path: '/office/privilegetemporary/',
    component: require('./components/office/privilegetemporary.vue'),
  },
  {
    path: '/office/contracts/',
    component: require('./components/office/files.vue'),
    options: {props: {title: '合同', root: 'contracts'}}
  },
  {
    path: '/office/carList/',
    component: require('./components/office/carList.vue'),
  },
  {
    path: '/office/carList/apply/',
    component: require('./components/office/carapply.vue'),
  },
  {
    path: '/office/carList/detail/',
    component: require('./components/office/cardetail.vue'),
  },
  {
    path: '/office/sealList/',
    component: require('./components/office/sealList.vue')
  },
  {
    path: '/office/sealList/apply/',
    component: require('./components/office/sealapply.vue'),
  },
  {
    path: '/office/sealList/detail/',
    component: require('./components/office/sealdetail.vue'),
  },
  {
    path: '/office/contractList/',
    component: require('./components/office/contractList.vue'),
  },
  {
    path: '/office/contractList/apply/',
    component: require('./components/office/contractapply.vue'),
  },
  {
    path: '/office/contractList/detail/',
    component: require('./components/office/contractdetail.vue'),
  },
  {
    path: '/office/performanceList/',
    component: require('./components/office/performanceList.vue'),
  },
  {
    path: '/office/performanceList/apply/',
    component: require('./components/office/performanceapply.vue'),
  },
  {
    path: '/office/performanceList/detail/',
    component: require('./components/office/performancedetail.vue'),
  },
  {
    path: '/office/goodsList/',
    component: require('./components/office/goodsList.vue'),
  },
  {
    path: '/office/goodsList/apply/',
    component: require('./components/office/goodsapply.vue'),
  },
  {
    path: '/office/goodsList/detail/',
    component: require('./components/office/goodsdetail.vue'),
  },
  {
    path: '/office/salesmanageList/',
    component: require('./components/office/salesmanageList.vue'),
  },
  {
    path: '/office/salesmanageList/apply/',
    component: require('./components/office/salesmanageapply.vue'),
  },
  {
    path: '/office/salesmanageList/detail/',
    component: require('./components/office/salesmanagedetail.vue'),
  },
  // client pages
  {
    path: '/client/client/',
    component: require('./components/client/client.vue')
  },
  {
    path: '/client/clientmgr/',
    component: require('./components/client/clientmgr.vue')
  },
  {
    path: '/client/clientsearch/',
    component: require('./components/client/clientsearch.vue')
  },
  {
    path: '/client/clientsearchresult/',
    component: require('./components/client/clientsearchresult.vue')
  },
  {
    path: '/client/visit/',
    component: require('./components/client/visit.vue')
  },

  {
    path: '/client/visitdateil/',
    component: require('./components/client/visitdateil.vue')
  },
  {
    path: '/client/visitmgr/',
    component: require('./components/client/visitmgr.vue')
  },
  {
    path: '/client/visitdateil/',
    component: require('./components/client/visitdateil.vue')
  },
  {
    path: '/client/visitemployees/',
    component: require('./components/client/visitemployees.vue')
  },
  {
    path: '/client/summary/',
    component: require('./components/client/summary.vue')
  },
  {
    path: '/client/selectcustomers/',
    component: require('./components/client/selectcustomers.vue')
  },
  {
    path: '/client/customersproson/',
    component: require('./components/client/customersproson.vue')
  },
  {
    path: '/client/visitset/',
    component: require('./components/client/visitset.vue')
  },
  {
    path: '/client/visitseacher/',
    component: require('./components/client/visitseacher.vue')
  },
  {
    path: '/client/visitseacherresult/',
    component: require('./components/client/visitseacherresult.vue')
  },
  {
    path: '/client/ocr/',
    component: require('./components/client/ocr.vue')
  },
  {
    path: '/client/invitationList/',
    component: require('./components/client/invitationList.vue'),
  },
  {
    path: '/client/invitationList/apply/',
    component: require('./components/client/invitationapply.vue'),
  },
  {
    path: '/client/invitationList/detail/',
    component: require('./components/client/invitationdetail.vue'),
  },

  // company setting pages
  {
    path: '/setting/profile/',
    component: require('./components/setting/profile.vue'),
  },
  {
    path: '/setting/holiday/',
    component: require('./components/setting/holiday.vue'),
  },
  {
    path: '/setting/tree/',
    component: require('./components/setting/tree.vue'),
  },
  {
    path: '/setting/company/',
    component: require('./components/setting/company.vue')
  },
  {
    path: '/office/organization',
    component: require('./components/setting/organization.vue')
  },
  {
    path: '/setting/company/timecards',
    component: require('./components/setting/timecards.vue')
  },
  {
    path: '/setting/company/timecard',
    component: require('./components/setting/timecard.vue')
  },
  {
    path: '/setting/company/personnel',
    component: require('./components/setting/personnel.vue')
  },
  {
    path: '/setting/meta/',
    component: require('./components/setting/meta.vue'),
  },
  {
    path: '/setting/devicelock/',
    component: require('./components/setting/devicelock.vue'),
  },
  {
    path: '/setting/performance/',
    component: require('./components/setting/performance.vue'),
  },
  {
    path: '/setting/expense/',
    component: require('./components/setting/expense.vue'),
  },
  {
    path: '/setting/car/',
    component: require('./components/setting/car.vue'),
  },
  {
    path: '/setting/seal/',
    component: require('./components/setting/seal.vue'),
  },
  {
    path: '/setting/paymenttype/',
    component: require('./components/setting/paymenttype.vue'),
  },

  // software setting
  {
    path: '/software/about/',
    component: require('./components/software/about.vue'),
  },
  {
    path: '/software/help/',
    component: require('./components/software/help.vue'),
  },
  {
    path: '/software/helpContent/',
    component: require('./components/software/help_content.vue'),
  },
  {
    path: '/software/moduleeditor/',
    component: require('./components/software/moduleeditor.vue'),
  },
  {
    path: '/software/reminder/',
    component: require('./components/software/reminder.vue'),
  },
  {
    path: '/software/subscriber/',
    component: require('./components/software/subscriber.vue'),
  },
  {
    path: '/software/system/',
    component: require('./components/software/system.vue'),
  },
  {
    path: '/software/setting/',
    component: require('./components/software/setting.vue'),
  },
  {
    path: '/software/visitingService/',
    component: require('./components/software/visitingService.vue'),
  },

  // finance
  {
    path: '/finance/fixedcost/',
    component: require('./components/finance/transactionviewer.vue'),
    options: {props: {contextType: 'fixedCost'}}
  },
  {
    path: '/finance/receivable/',
    component: require('./components/finance/transactionviewer.vue'),
    options: {props: {contextType: 'receivable'}}
  },
  {
    path: '/finance/payable/',
    component: require('./components/finance/transactionviewer.vue'),
    options: {props: {contextType: 'payable'}}
  },
  {
    path: '/finance/transaction/',
    component: require('./components/finance/transaction.vue'),
  },
  {
    path: '/finance/auditlist/',
    component: require('./components/finance/auditlist.vue'),
  },
  {
    path: '/finance/transsearchresult/',
    component: require('./components/finance/transsearchresult.vue'),
  },
  {
    path: '/finance/entry/',
    component: require('./components/finance/entry.vue'),
  },
  {
    path: '/finance/ledger/',
    component: require('./components/finance/ledger.vue'),
  },
  {
    path: '/finance/ledgerlist/',
    component: require('./components/finance/ledgerlist.vue'),
  },
  {
    path: '/finance/docs/',
    component: require('./components/office/files.vue'),
    options: {props: {title: '财务', root: 'financialdocs'}}
  },
  {
    path: '/finance/salary/',
    component: require('./components/finance/salary.vue')
  },
  {
    path: '/finance/salary/enterSalary',
    component: require('./components/finance/enterSalary.vue')
  },
  {
    path: '/setting/finance/',
    component: require('./components/setting/finance.vue')
  },

  // test only
  {
    path: '/test/',
    component: require('./components/test.vue')
  },
  {
    path: '/inprogress/',
    component: require('./components/inprogress.vue')
  },
  {
    path: '/report/report',
    component: require('./components/report/report.vue')
  },
  {
    path: '/report/datatemplate',
    component: require('./components/report/datatemplate.vue')
  },
  {
    path: '/report/selectdepartment',
    component: require('./components/report/selectdepartment.vue')
  },
  {
    path: '/report/submitdata',
    component: require('./components/report/submitdata.vue')
  },
  {
    path: '/report/history',
    component: require('./components/report/history.vue')
  },
  {
    path: '/report/reportdetail',
    component: require('./components/report/reportdetail.vue')
  },
  {
    path: '/report/statistics/',
    component: require('./components/report/statistics.vue')
  },
  {
    path: '/report/selfstatistics',
    component: require('./components/report/selfstatistics.vue')
  },
  {
    path: '/report/statisticsindex',
    component: require('./components/report/statisticsindex.vue')
  },
  {
    path: '/report/companystatistics',
    component: require('./components/report/companystatistics.vue')
  },
  {
    path: '/report/departmentstatistics',
    component: require('./components/report/departmentstatistics.vue')
  },
  {
    path: '/report/staffstatistics',
    component: require('./components/report/staffstatistics.vue')
  },
  {
    path: '/report/reportlist',
    component: require('./components/report/reportlist.vue')
  },
  {
    path: '/report/reportaudit',
    component: require('./components/report/reportaudit')
  },
  {
    path: '/trade/buy',
    component: require('./components/trade/buy')
  },
  {
    path: '/trade/info',
    component: require('./components/trade/info')
  },
  {
    path: '/trade/pay',
    component: require('./components/trade/pay')
  },
  {
    path: '/notification/messagelist',
    component: require('./components/notification/messagelist')
  },
  {
    path: '/notification/detail',
    component: require('./components/notification/detail')
  },
  {
    path: '/chat/chat',
    component: require('./components/chat/chat')
  },
  {
    path: '/chat/people',
    component: require('./components/chat/people')
  }
];

module.exports = routes;
