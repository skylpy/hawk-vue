
function toDate(time) {
    let hms = time.split(':');
    let hh = parseInt(hms[0]), mm = parseInt(hms[1]), ss = parseInt(hms[2] ? hms[2] : '0');
    let d = new Date();
    d.setHours(hh); d.setMinutes(mm); d.setSeconds(ss);
    return d;
}

const onehour = 60*60*1000;

function checkin_on(time/*HH:MM*/, range, records) {
    let on = toDate(time).getTime();
    if (!records || records.length == 0) return {
        status: '不打卡',
        detail: `上班时间: ${toDate(time).toHawkString()} | 打卡时间: 无`
    };

    let validRec = records.filter(r => {
        if (range && r.offset > range) return false;
        let start = on - onehour; //提前1小时可以上班打卡
        let end = on + onehour; //迟到超过1小时等于不打卡
        let checkinAt = toDate(r.time).getTime();

        if (checkinAt > start && checkinAt < end) return true;
        return false;
    })

    if (validRec.length < 1) return {
        status: '不打卡',
        detail: `上班时间: ${toDate(time).toHawkString()} | 打卡时间: 不在正常区间`
    };

    let firstRec = validRec[0];
    let arrivedAt = toDate(firstRec.time).getTime();

    if (arrivedAt <= on) return { status: '正常'};

    let late = (arrivedAt - on) / (60*1000); // minutes
    return {status: '迟到', quantity: late};
}

function checkin_off(time/*HH:MM*/, range, records) {
    let off = toDate(time).getTime();

    if (!records || records.length == 0) return {
        '不打卡': true,
        detail: `下班时间: ${toDate(time).toHawkString()} | 打卡时间: 无`
    };

    let validRec = records.filter(r => {
        if (range && r.offset > range) return false;
        let start = off - onehour; // 早退超过1小时等于不打卡
        let checkinAt = toDate(r.time).getTime();

        if (checkinAt > start) return true;
        return false;
    })

    if (validRec.length < 1) return {
        '不打卡': true,
        detail: `下班时间: ${toDate(time).toHawkString()} | 打卡时间: 不在正常区间`
    };

    let lastRec = validRec.pop();
    let leaveAt = toDate(lastRec.time).getTime();

    if (leaveAt >= off) return {status: '正常'};

    let early = (off - leaveAt) / (60*1000); // minutes
    return {status: '早退', quantity: early};
}

export {
    checkin_on,
    checkin_off
}
