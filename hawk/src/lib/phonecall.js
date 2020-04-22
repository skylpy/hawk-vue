
function sanity() {
    if (typeof cordova.plugins.CordovaCall == 'undefined' ||  !cordova.plugins.CordovaCall) {
        console.error('phone device is not ready');
        return false;
    }
    return true;
}

function call(phoneNumber) {

    if (!sanity()) return;

    if (!phoneNumber || !(/^\d+$/.test(phoneNumber))) {
        console.error('tried to make a call with fake number', phoneNumber);
        return;
    }

    cordova.plugins.CordovaCall.callNumber(phoneNumber, () => {
        console.debug('phone call succeed', phoneNumber);
    }, (err) => {
        console.debug('phone call failed', phoneNumber)
    });
}

export {
    call
}