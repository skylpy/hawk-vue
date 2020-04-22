const state = {
  initHandler: false,
  downloads: []
}

const getters = {
  downloads_complete: state=> state.downloads && !state.downloads.find(f => f.progress != 100),
}

const actions = {
  getOssFileUrl({commit, state, dispatch}, files) {
    return Promise.all(files.map(f => {
      return new Promise((resolve, reject) => {
        getSignUrl(f.oss, (url) => {
          // f.signedUrl = url + '';
          commit('DOWNLOADED_SET', f, 'signedUrl', url + '');
          resolve();
        });
      });
    }));
  },
  initDownload({commit, state, dispatch}, params) {

    if (!window.downloader_init) {
      let folder = 'hawkDownloads';
      let fileSystem = device.platform == 'Android' ? cordova.file.externalRootDirectory : (
        device.platform == 'iOS' ? cordova.file.documentsDirectory : cordova.file.dataDirectory
      );
      console.log(cordova.file, fileSystem, folder)
      downloader.init({folder, fileSystem});
      window.downloader_init = true;
    }

    document.addEventListener('DOWNLOADER_initialized', function (event) {
      var data = event.data;
      console.log('DOWNLOADER_gotFolder', data);
    });

    document.addEventListener('DOWNLOADER_gotFolder', function (event) {
      var data = event.data; // data:[cordova.fileEntry folder]
      console.log('DOWNLOADER_gotFolder', data[0].fullPath, data);
    });

    document.addEventListener('DOWNLOADER_error', function (event) {
      var data = event.data; // data:[object error]
      console.error('DOWNLOADER_error', data);
    });

    document.addEventListener('DOWNLOADER_downloadSuccess', function (event) {
      var data = event.data; // [cordova.fileEntry entry]
      data.forEach(fileEntry => {
        let f = state.downloads.find(f => f.name == fileEntry.name);
        // f.localPath = fileEntry.fullPath;
        // f.nativeURL = fileEntry.nativeURL;
        // f.progress = 100;
        commit('DOWNLOADED_SET', f, 'localPath', fileEntry.fullPath);
        commit('DOWNLOADED_SET', f, 'nativeURL', fileEntry.nativeURL);
        commit('DOWNLOADED_SET', f, 'progress', 100);
      });
      console.log('DOWNLOADER_downloadSuccess', data);
    });

    document.addEventListener('DOWNLOADER_downloadError', function (event) {
      var data = event.data; // data:[object error]
      console.error('DOWNLOADER_downloadError', data);
    });

    document.addEventListener('DOWNLOADER_downloadProgress', function (event) {
      var data = event.data; // data:[number percentage, string fileName]
      let f = state.downloads.find(f => f.name == data[1]);
      if (f) {
        // f.progress = data[0];
        commit('DOWNLOADED_SET', f, 'progress', data[0]);
      }
    });
    commit('DOWNLOADED_INIT');
  },
  download({commit, state, dispatch}, {item, type}) {
    if (state.initHandler) {
      dispatch('initDownload');
    }
    let file
    if (type == 'img') {
      let typeArr = item.content.imageUri.split('.')
      if (typeArr.length != 3) {
        $alert('格式错误')
        return;
      }
      file = {
        oss: item.content.imageUri,
        name: item.content.imageUri,
        signedUrl: null,
        type: typeArr.length == 3 ? typeArr[2] : 'jpeg'
      };
    } else {
      file = {
        oss: item.content.fileUrl,
        name: item.content.name,
        signedUrl: null,
        type: item.content.type
      };
    }
    if (state.downloads.filter(f => f.oss == file.oss).length) {
      $alert('该文件已在下载列表中');
      return;
    }
    commit('DOWNLOADED_PUSH', file)
    // state.downloads.push(file)
    $confirm(`确定要下载这个文件吗？`, '操作确认', () => {
      console.log('准备下载文件', state.downloads)

      getSignUrl(file.oss, (url) => {
        // f.signedUrl = url + '';
        commit('DOWNLOADED_SET', f, 'signedUrl', url + '');
        downloader.get(url + '');
      });


      dispatch('getOssFileUrl', files).then(() => {
        console.log('准备下载文件地址', state.downloads)
        downloader.getMultipleFiles(state.downloads.map(f => {
          return {url: f.signedUrl, name: f.name};
        }));
      });
    });
  },
  download_abort({commit, state, dispatch}, params) {
      downloader.abort();
  },
  fileOpener2({commit, state, dispatch}, {file, type}) {
    console.log('fileOpener2', file, type, cordova.plugins.fileOpener2)
    if (!file) return;
    cordova.plugins.fileOpener2.open(file, 'application/' + type, {
        error: function (e) {
          console.log('Error status: ' + e.status + ' - Error message: ' + e.message, e);
          if (e.status == 9) {
            $alert('没有找到支持' + type + '格式的应用');
          }
        },
        success: function () {
          console.log('file opened successfully');
        }
      }
    );
  },

}

const mutations = {
  DOWNLOADED_INIT(state) {
    state.initHandler = true;
  },
  DOWNLOADED_SET(state, {item, key, value}) {
    state.downloads.forEach(file => {
      if (file == item) {
        file[key] = value;
      }
    });
  },
  DOWNLOADED_PUSH(state, item) {
    state.downloads.push(item);
  },
  DOWNLOADED_DELE(state, item) {
    let index = state.downloads.findIndex(msg => msg == item);
    if (index >= 0) state.downloads.splice(index, 1);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
};
