import { dataURItoBlob, guid } from './utils'

function SYSTEM_TEMP_PATH() {
  if (device.platform === 'iOS') {
    return ''
  } else if (device.platform === 'Android') {
    return cordova.file.applicationStorageDirectory
  }
}

function recordAudioPermission() {
  console.log('checking android permissions')
  var perms = ['android.permission.RECORD_AUDIO']
  const Permission = window.plugins.Permission

  return new Promise((resolve, reject) => {
    Permission.has(
      perms,
      function (results) {
        perms.forEach(perm => {
          if (!results[perm]) {
            Permission.request(
              perm,
              function (results) {
                if (results[perm]) {
                  console.log(perm + ' is granted')
                  resolve(true)
                } else {
                  resolve(false)
                }
              },
              err => {
                console.error('permission error', err)
                reject(err)
              }
            )
          }
        })
      },
      err => {
        console.error('permission error', err)
      }
    )
  })
}

/**
 * cordova-plugin-media 插件
 * 需要调整文件系统，不方便
 * success Callback 函数
 * error Callback 函数
 * stChange Callback 函数
 */
function getMedia(filePath, success, error, stChage) {
  console.log('In function getMedia', filePath)
  return new Media(filePath, success, error, stChage)
  // return new Media(`cdvfile://localhost/temporary/${fileName}.wav`, success, error, stChage)
}


function getFileContentAsBase64Android(path, callback) {
  window.resolveLocalFileSystemURL(path, gotFile, fail)

  function fail(e) {
    console.error('Fail Get File Infomation')
  }

  function gotFile(fileEntry) {
    fileEntry.file(file => {
      var reader = new FileReader()
      reader.onloadend = function (e) {
        var content = this.result
        callback(content)
      }
      // The most important point, use the readAsDatURL Method from the file plugin
      reader.readAsDataURL(file)
    })
  }
}

/**
 * 转base64的代码
 * @param {String} path 文件路径
 * @param {Function} callback 回调函数，参数是base64文本Str
 */
function getFileContentAsBase64Ios(path, callback) {
  console.log('File Path in getFileContentAsBase64', path)

  window.requestFileSystem(
    window.TEMPORARY,
    0,
    fs => {
      console.log('gotFile Step0')
      console.log('file system open: ' + fs.name)

      fs.root.getFile(
        path,
        { create: false, exclusive: true },
        fileEntry => {
          console.log('gotFile Step1')
          console.log('fileEntry is file ? ' + fileEntry.isFile.toString())

          fileEntry.file(file => {
            console.log('gotFile Step2')
            var reader = new FileReader()
            reader.onloadend = function (e) {
              console.log('gotFile Step3')
              var content = this.result
              callback(content)
            }
            // The most important point, use the readAsDatURL Method from the file plugin
            console.log('File Reader', reader)
            reader.readAsDataURL(file)
          })
        },
        error => {
          console.error('gotFile Step0', error)
          console.error('gotFile 0 File name', path)
        }
      )
    }
  )

}

function createTempMediaFromBase64(base64Str, mediaName) {
  var dataObj = dataURItoBlob(base64Str)

  return new Promise((resolve, reject) => {
    window.requestFileSystem(
      window.TEMPORARY, // 临时目录
      dataObj.size, //
      fs => {
        console.log('file system open: ' + fs.name)

        fs.root.getFile(
          mediaName,
          { create: true, exclusive: false },
          fileEntry => {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                console.log('Successful file write...')
                resolve(fileEntry)
              }

              fileWriter.onerror = function (e) {
                console.error('Failed file write: ' + e.toString())
                reject(e)
              }

              // If data object is not passed in,
              // create a new Blob instead.

              fileWriter.write(dataObj)
            })
          },
          error => {
            reject(error)
          }
        )
      },
      error => {
        reject(error)
      }
    )
  })
}

function getTempMedia(mediaName) {
  return new Promise((resolve, reject) => {
    window.requestFileSystem(
      window.TEMPORARY,
      0,
      fs => {
        console.log('file system open: ' + fs.name)
        fs.root.getFile(
          mediaName,
          { create: false, exclusive: true },
          fileEntry => {
            // console.dir(fileEntry)
            // debugger
            console.log('fileEntry is file ? ' + fileEntry.isFile.toString())

            fileEntry.file(
              file => {
                if (!file.size) {
                  console.log('No Named Temp File')
                  return resolve(false)
                }

                resolve(fileEntry)
              },
              error => {
                console.log('Check File Size wrong', error)
                resolve(false)
              }
            )
          },
          error => {
            console.log('Get File Path wrong', error)
            resolve(false)
          }
        )
      },
      error => {
        reject(error)
      }
    )
  })
}

/**
 *  cordova-plugin-media-capture 插件
 * 会弹出系统的录音APP，不采用

function audioCapture() {
  // 开始录音（最长录制时间：10秒）
  navigator.device.capture.captureAudio(onSuccess, onError, { duration: 10 }) // 录制成功
  function onSuccess(mediaFiles) {
    var i, len // 遍历获取录制的文件
    // 注意：iOS只支持一次录制一个视频或音频
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      console.log(mediaFiles[i])
      var path = mediaFiles[i].fullPath
      path = decodeURIComponent(path)
      var localURL = mediaFiles[i].localURL
      localURL = decodeURIComponent(localURL)
      alert(
        '录制成功！\n\n' +
          '文件名：' +
          mediaFiles[i].name +
          '\n' +
          '大小：' +
          mediaFiles[i].size +
          '\n\n' +
          'localURL地址：' +
          localURL +
          '\n\n' +
          'fullPath地址：' +
          path
      )
    }
  } //录制失败
  function onError(error) {
    alert('录制失败！错误码：' + error.code)
  }
}

 */

/* ================= audioRecorderAPI 录音时长不超过20s, 有很大问题 ================== 
 * 开始录音
 * @param {Function} success 成功
 * @param {Function} error 失败
function audioRecordStart(success, error) {
  window.plugins.audioRecorderAPI.record(success, error)
}

 * 停止录音
 * 调用 audioRecordStart 后调用才会录音
 * @param {Function} success 成功
 * @param {Function} error 失败
function audioRecordStop(success, error) {
  window.plugins.audioRecorderAPI.stop(success, error)
}

 * 上一段录音的回放
 * 调用 audioRecordStop 后调用才有回放
 * @param {Function} success 成功
 * @param {Function} error 失败

function audioRecordPlayback(success, error) {
  window.plugins.audioRecorderAPI.stop(success, error)
}
*/

// 用最低的采样标准
const RECORD_OPTIONS = {
  SampleRate: 8000,
  NumberOfChannels: 1
}


let tmpRecordMeida
let mediaName

function audioRecordStart() {
  mediaName = SYSTEM_TEMP_PATH() + guid() + '.m4a'
  console.log('mediaName Create in audioRecordStart', mediaName)

  return new Promise((resolve, reject) => {
    try {
      tmpRecordMeida = new Media(mediaName, () => {
        console.log('tmpRecordMedia is Created')
      }, error => {
        console.log('tmpRecordMedia Created Faild')
        reject(error)
      })
      tmpRecordMeida.startRecordWithCompression(RECORD_OPTIONS)
      resolve(mediaName)
    } catch (error) {
      reject(error)
    }
  })
}

function audioRecordStop() {
  return new Promise((resolve, reject) => {
    try {
      if (!tmpRecordMeida) {
        console.log('tmpRecordMedia is not found', tmpRecordMeida)
        tmpRecordMeida = new Media(mediaName, () => {
          console.log('Re New Media Obj from', medianame)
        }, error => {
          console.log('tmpRecordMedia Found Faild')
          reject(error)
        })
      }
      tmpRecordMeida.stopRecord()

      resolve(mediaName)
    } catch (error) {
      reject(error)
    }
  })
}


export {
  recordAudioPermission,
  getFileContentAsBase64Ios,
  getFileContentAsBase64Android,
  createTempMediaFromBase64,
  getTempMedia,
  getMedia,
  audioRecordStart,
  audioRecordStop
}
