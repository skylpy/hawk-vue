function createDateTimePicker(app, cb, initDate) {

    let inputElement = document.createElement("input");
    let today = initDate || new Date();
    
    let dateTimePicker = app.picker.create({
        inputEl: inputElement,
        toolbarCloseText: '完成',
        rotateEffect: true,
        value: [
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),        
            today.getHours(),
            today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
        ],
        formatValue: function (values, displayValues) {
            return displayValues[1] + ' ' + values[2] + ', ' + values[0] + ' ' + values[3] + ':' + values[4];
        },
        cols: [
        // Years
        {
            values: (function () {
                var arr = [];
                for (var i = 1950; i <= 2030; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Months
        {
            values: ('0 1 2 3 4 5 6 7 8 9 10 11').split(' '),
            displayValues: ('一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月').split(' '),
            textAlign: 'left'
        },
        // Days
        {
            values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        },
        // Space divider
        {
            divider: true,
            content: '&nbsp;&nbsp;'
        },
        // Hours
        {
            values: (function () {
            var arr = [];
            for (var i = 0; i <= 23; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Divider
        {
            divider: true,
            content: ':'
        },
        // Minutes
        {
            values: (function () {
            var arr = [];
            for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
        }
        ],
        on: {
        change: function (picker, values, displayValues) {
            var daysInMonth = new Date(picker.value[0], picker.value[1]*1 + 1, 0).getDate();
            if (values[2] > daysInMonth) {
            picker.cols[2].setValue(daysInMonth);
            }

            if (cb) {
                cb(new Date(values[0], values[1], values[2], values[3], values[4], 0));
            }
        },
        }
    });

    dateTimePicker.close();
    return dateTimePicker;
}

function createMonthPicker(app, cb, isHistory) {
    let inputElement = document.createElement("input");
    let today = (new Date()).toHawkDateString().split('-');

    let monthPicker = app.picker.create({
        inputEl: inputElement,
        toolbarCloseText: '确定',
        rotateEffect: true,
        value: [
            today[0],
            today[1]
        ],
        formatValue: function (values, displayValues) {
            return displayValues[0] + '年' + displayValues[1] + '月';
        },
        cols: [
        // Years
        {
            values: (function () {
                var arr = [];
                if (isHistory) {
                    for (var i = 2019; i >= 1980; i--) { arr.push(i); }
                } else{
                    for (var i = 2019; i <= 2030; i++) { arr.push(i); }
                }
                return arr;
            })(),
        },
        {
            divider: true,
            content: '年'
        },
        // Months
        {
            values: ('01 02 03 04 05 06 07 08 09 10 11 12').split(' '),
            displayValues: ('一 二 三 四 五 六 七 八 九 十 十一 十二').split(' '),
        },
        {
            divider: true,
            content: '月'
        },
        ],
        on: {
            open: () => {
                $('.page-current').addClass('no-swipeback');
            },
            close: () => {
                $('.page-current').removeClass('no-swipeback');
            },
            closed: cb
        }
    });

    monthPicker.close();
    return monthPicker;
}

export {
    createDateTimePicker,
    createMonthPicker
}