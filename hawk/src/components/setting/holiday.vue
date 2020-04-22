<template>
    <f7-page>
        <f7-navbar title="节假日设置" back-link>
            <f7-nav-right>
                <f7-link href="#" @click="submit">保存</f7-link>
            </f7-nav-right>
        </f7-navbar>

        <div class="block-title">请点击选择节假日</div>
        <div class="block block-strong no-padding">
            <div id="holiday-calendar-container"></div>
        </div>

    </f7-page>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
    props: [
        'lastPage'
    ],

    data() {
        return {
            calendar: null
        }
    },

    computed: {
        ...mapGetters([
            'myCompany'
        ]),

        holidays() { return this.myCompany.holidays }
    },

    mounted: function() {
        if (!this.calendar) this.init();
    },

    methods: {
        ...mapMutations({
            'update': 'COM_UPDATE'
        }),
        ...mapActions({
            'save': 'SAVE_COM_KEY'
        }),

        submit() {
            $preloader.show();
            this.save('holidays').then(() => {
                $preloader.hide();
                this.$f7router.back();
            }).catch(error => {
                $preloader.hide();
                console.error(error);
                $alert('无法更新数据，请稍后再试', '操作错误');
            })
        },

        set(value) {
            let days = value.slice(0);
            this.update({holidays: days});
        },

        init() {
            let app = this.$f7;
            let monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'];
            let set = this.set;
            let intialialValue = this.holidays && this.holidays.map(i => new Date(i)) || [];

            let calendarInline = app.calendar.create({
                containerEl: '#holiday-calendar-container',
                value: intialialValue,
                multiple: true,
                weekHeader: false,
                renderToolbar: function () {
                    return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
                    '<div class="toolbar-inner">' +
                        '<div class="left">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
                        '</div>' +
                        '<div class="center"></div>' +
                        '<div class="right">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
                        '</div>' +
                    '</div>' +
                    '</div>';
                },
                on: {
                    init: function (c) {
                        $('.calendar-custom-toolbar .center').text(c.currentYear + '年 ' + monthNames[c.currentMonth]);
                        $('.calendar-custom-toolbar .left .link').on('click', function () {
                            calendarInline.prevMonth();
                        });
                        $('.calendar-custom-toolbar .right .link').on('click', function () {
                            calendarInline.nextMonth();
                        });
                        },
                        monthYearChangeStart: function (c) {
                        $('.calendar-custom-toolbar .center').text(c.currentYear + '年 ' + monthNames[c.currentMonth]);
                    },

                    change: function(c, value) {
                        set(value);
                    }
                }
            });

            this.calendar = calendarInline;
        }
    }
}
</script>

