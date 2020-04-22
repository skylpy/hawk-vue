
function grantAndroidPermission() {
    if (device.platform != "Android") return;

    var perms = [
        'android.permission.CAMERA',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.CALL_PHONE',
        'android.permission.READ_EXTERNAL_STORAGE',
        // 'android.permission.RECORD_AUDIO'
    ];

    if (typeof window.plugins.Permission == 'undefined') {
        return Promise.reject(new Error('window.plugins.Permission unavailable'));
    }
    
    console.log('checking android permissions');
    const Permission = window.plugins.Permission;

    Permission.has(perms, function(results) {

        perms.forEach(perm => {
            if (!results[perm]) {
                Permission.request(perm, function(results) {
                    if (results[perm]) { console.log(perm + ' is granted') }
                }, (err) => {
                    console.error("permission error", err);
                });
            }
        });

    }, (err) => {
        console.error("permission error", err);
    });
}

function enableLocalNotification() {
    if (!['Android', 'iOS'].includes(device.platform)) return;

    console.log('check permission for local notification');

    cordova.plugins.notification.local.hasPermission(function (granted) {
        
        if (granted) {
            console.log('local notification permission granted');
            return;
        }

        cordova.plugins.notification.local.requestPermission(function (granted) {
            if (granted) {
                console.log('local notification permission granted');
            } else {
                console.error('local notification permission denied');
            }
        });
    });
}

function setPermission() {
    grantAndroidPermission();
    enableLocalNotification();
}

export { setPermission };