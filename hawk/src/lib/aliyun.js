import axios from 'axios';
import OSS from 'ali-oss';
import {dataURItoBlob} from 'lib/utils';

let setting = {};
let signatureUrls = {};
let oss = null;
let timeError = 1000*60*5; // 过期时间剩余五分种内也获取新的
let isSuccess = -1
function isOutdated() {
  if (!oss) {
    return true;
  }
  let expiration = (setting && setting.credentials && setting.credentials.Expiration) || '';
  let bool = !expiration || (Date.parse(expiration) < (Date.now()))
  if (bool) isSuccess = -1
  return bool;
}
function refresh() {
  // oss is still valid
  return new Promise(function(resolve, reject) {
    let cycle = () => {
      let time = setTimeout(() => {
        doIt();
        clearTimeout(time);
      }, 300);
    }
    let doIt = () => {
      if (isSuccess === -1) {
        isSuccess = 0
        axios.get('api/utils/ossrole').then(res => {
          setting = res.data;
          if (!setting.credentials || !setting.oss) {
            throw new Error('invalid oss settings');
          } else {
            console.info('Successfully refresh oss setting');
            oss = new OSS({
              region: setting.oss.region,
              accessKeyId: setting.credentials.AccessKeyId,
              accessKeySecret: setting.credentials.AccessKeySecret,
              stsToken: setting.credentials.SecurityToken,
              bucket: setting.oss.bucket
            });
            resolve(oss);
            isSuccess = 1;
          }
        }).catch(err => {
          isSuccess = -1;
          cycle();
        });
      } else if (isSuccess === 1) {
        resolve(oss);
      } else {
        cycle();
      }
    };
    doIt();
  });
  // try {
  //   if (!isOutdated()) {
  //     return true;
  //   }
  //
  //   console.info('refreshing oss setting...');
  //
  //   // clean up everything
  //   setting = {};
  //   signatureUrls = {};
  //   oss = null;
  //
  //   // reload role credentials
  //   let res = await axios.get('api/utils/ossrole');
  //   setting = res.data;
  //
  //   if (!setting.credentials || !setting.oss) {
  //     throw new Error('invalid oss settings');
  //   } else {
  //     console.info('Successfully refresh oss setting');
  //     oss = new OSS({
  //       region: setting.oss.region,
  //       accessKeyId: setting.credentials.AccessKeyId,
  //       accessKeySecret: setting.credentials.AccessKeySecret,
  //       stsToken: setting.credentials.SecurityToken,
  //       bucket: setting.oss.bucket
  //     });
  //   }
  //
  // } catch (err) {
  //   console.error(err);
  //   setting = {};
  //   oss = null;
  // }
} // refresh()

function getSignUrl(f, cb) {
  if (!f) {
    return f;
  }

  // return cached url
  if (!isOutdated() && signatureUrls[f]) {
    cb(signatureUrls[f])
    return;
  }

  // fetch new signature url
  refresh().then(() => {
    try {
      if (!oss) {
        throw new Error('invalid oss connection detected');
      }
      let signUrl = oss.signatureUrl(f, {expires: 3600 * 24 * 30}); //一个月
      signatureUrls[f] = signUrl;
      cb(signUrl);

    } catch (err) {
      console.error(err);
      cb(err);
    }
  });
} // getSignUrl()

function upload(dataUrl, cb, ext) {
  refresh().then(() => {
    if (!oss) {
      cb(new Error('Invalid oss connection detected'));
      return;
    }
    let fileBlob = dataURItoBlob(dataUrl);
    let fileExt = ext || dataUrl.split(/[,:;//]/)[2];

    // create a unique file name to save in oss
    let remoteFileName = (device.uuid || device.platform || 'unknown') + '.' + Date.now() + '.' + fileExt;
    console.log('555555555555',fileBlob,fileExt)
    oss.put(remoteFileName, fileBlob).then((ret) => {
      console.debug('successfully upload file', remoteFileName);
      cb(remoteFileName);
    }).catch((err) => {
      console.error('upload', err)
      cb(err);
    });
  }).catch(err=>{
    console.error('upload', err);
  });
} // upload()

function selectAndUpload(onSelected, onUploaded) {
  // 模拟input点击事件
  var evt = new MouseEvent("click", {bubbles: false,cancelable: true,view: window});
  var inputNode = document.createElement("input");
  inputNode.type="file";
  inputNode.style.display = 'none';
  document.body.insertBefore(inputNode, document.body.firstElementChild);
  inputNode.addEventListener('change',change)
  inputNode.dispatchEvent(evt);

  function change() {
    let filename = this.files && this.files[0] && this.files[0].name || '';
    if (!filename) return;
    let file = this.files[0]
    onSelected(file);
    // 不允许上传大于10M文件
    if (file.size >= (1024 * 1024 * 100)) {
      onUploaded(new Error('不允许上传大于100M文件'))
      return;
    }
    let fr = new FileReader();
    fr.onload = function (event) {
      upload(event.target.result, onUploaded, filename.split('.').pop());
    };
    fr.onerror = function (error) {
      console.error(error);
      onUploaded(error);
    };
    fr.readAsDataURL(this.files[0]);

    var parentNode = inputNode.parentNode;
    if(parentNode) parentNode.removeChild(inputNode);
  }


  // let html = '<input type="file" style="display: none">';
  // $(html).change(change).click();
}

function getPreviewUrl(target,cb) {
  refresh().then(() => {
    // expected target format: "oss://hawkbet/converttask/browser_1548840153278_docx"
    let url = 'https://hawkbet.oss-cn-shenzhen.aliyuncs.com/converttask/' + target.split('/').pop();
    let accessKeyId = setting.credentials.AccessKeyId;
    let accessKeySecret = setting.credentials.AccessKeySecret;
    let stsToken = setting.credentials.SecurityToken.replace(/\+/g, '%2B');
    let bucket = setting.oss.bucket;
    let region = setting.oss.region;
    if(cb)cb(`https://preview.imm.aliyun.com/index.html?url=${url}&accessKeyId=${accessKeyId}&accessKeySecret=${accessKeySecret}&stsToken=${stsToken}&bucket=${bucket}&region=${region}`);
  });
}

export {
  getSignUrl,
  upload,
  selectAndUpload,
  refresh,
  getPreviewUrl
};
