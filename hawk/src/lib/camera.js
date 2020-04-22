
function setOptions(srcType,correctOrientation, allowEdit) {

    var options = {
        quality: 50, // Some common settings are 20, 50, and 100
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: typeof allowEdit == 'boolean'?allowEdit:true,
        correctOrientation: typeof correctOrientation == 'boolean'?correctOrientation:true  //Corrects Android orientation quirks
    }
    return options;
}

function openCamera(cb, selection,correctOrientation,allowEdit) {
    if (typeof Camera == 'undefined' || !Camera) {
        cb(new Error('设备无法使用'));
        return;
    }
    console.log('opening camera...');

    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType,correctOrientation,allowEdit);

    if (selection && selection == "thumb") {
        options.targetHeight = 100;
        options.targetWidth = 100;
    }

    navigator.camera.getPicture(function cameraSuccess(base64Data) {
        let dataUrl = "data:image/jpeg;base64," + base64Data;
        cb(dataUrl,base64Data);
    }, function cameraError(error) {
        console.error("Unable to obtain picture: ", error);
        cb(new Error(error));
    }, options);

} // openCamera

function openFilePicker(cb,correctOrientation,allowEdit) {
    console.log('opening gallery...');

    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType,correctOrientation,allowEdit);
    navigator.camera.getPicture(function cameraSuccess(base64Data) {
        let dataUrl = "data:image/jpeg;base64," + base64Data;
        cb(dataUrl,base64Data);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: ", error);
        cb(new Error(error));
    }, options);
}

function openPhotoBrowser(ev) {
    let photos = [];
    $(ev.target.parentElement).find('img').each((index, elm) => {
        photos.push(elm.src);
    });

    let pb = $f7.photoBrowser.create({ photos });

    pb.on('closed', () => { pb.destroy(); })
    pb.open();
}

export {
    openCamera,
    openFilePicker,
    openPhotoBrowser
}
