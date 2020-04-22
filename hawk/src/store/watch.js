import axios from 'axios';
function onSoftwareSettingUpdate(state) {
    let reminder = state.software.reminder;

    console.log('setting local notification', reminder);
    
    cordova.plugins.notification.local.setDefaults({
        sound: reminder.sound,
        vibrate: reminder.vibrate
    }, function(ret) {
        console.log('local notification:', ret);
    });
}

export default function(store) {

    // watching store mutations
    store.subscribe((mutation, state) => {
        switch (mutation.type) {
            case 'SOFTWARE_CONFIG_SET': onSoftwareSettingUpdate(state); break;
            default: break;
        }
    });

    store.watch(state => state.user.profile.notification, function() {
        console.log('receiving notification update...');

        let notification = store.state.user && store.state.user.profile.notification;
        if (!notification || !(notification instanceof Array)) return;

        if (!store.state.software.reminder.notification) return;

        notification.forEach(n => {

            if (!store.state.software.subscriber[n.category]) {
                console.log('skip notificatoin for', n.category);
                return;
            }

            console.log('sending local notification', n);
            if (!n.status) {
              cordova.plugins.notification.local.schedule({
                title: n.category,
                text: n.description,
                foreground: true,
                trigger: { at: new Date( new Date().getTime() + 10 ) },
                actions: [
                  { id: 'detail', title: '查看详情' }
                ],
                data: notification
              }, function(ret){
                console.log('local notification returned:', ret);
              });
              n.status = '已发送';
              store.state.user.profile.notification = notification;
              console.log('update local notification', store.state.user.profile);
              axios.put('api/users/', store.state.user.profile);
            }

        });
    });

}
