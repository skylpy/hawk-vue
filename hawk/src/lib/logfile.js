
let logfile = 'log.txt';

function error_hander(e) {
    console.error(e);
}

function readFromLogFile(cb) {
    if (!window.requestFileSystem) {
        console.error('file system is not ready yet!');
        return;
    }

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        fs.root.getFile(logfile, { create: true, exclusive: false }, function (fileEntry) {

            fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function() { cb(this.result) };
                reader.readAsText(file);
            }, error_hander);
    
        }, error_hander);
    }, error_hander);
}

function saveToLogFile(log) {
    if (!window.requestFileSystem) {
        console.error('file system is not ready yet!');
        return;
    }

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        fs.root.getFile(logfile, { create: true, exclusive: false }, function (fileEntry) {
    
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function() {  };
                fileWriter.onerror = error_hander;
                fileWriter.write(new Blob([JSON.stringify(log)], { type: 'text/plain' }));
            });

        }, error_hander);
    }, error_hander);
}

export {
    saveToLogFile,
    readFromLogFile
}