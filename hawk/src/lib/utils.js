import { getSignUrl } from 'lib/aliyun';

function uniquePageId(what) {
    return 'page_' + what + '_' + Date.now();
}

const default_avatar = require('assets/images/hp_default_70@2x.png')

function loadAvatar(avatar, cb) {

    if (!avatar) {
        cb(default_avatar);
        return;
    }
    
    getSignUrl(avatar, (urlOrErr) => {
        if (urlOrErr instanceof Error) {
            cb('#');
        } else {
            cb(urlOrErr);
        }
    });
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
}

/*
pySegSort(["我","不","懂","爱","啊","按","已","呀","选","县"])
returns
[
　　{"letter":"a","data":["啊","爱","按"]},
　　{"letter":"b","data":["不"]},
　　{"letter":"d","data":["懂"]},
　　{"letter":"w","data":["我"]},
　　{"letter":"x","data":["县","选"]},
　　{"letter":"y","data":["呀","已"]}
]
*/
function pySegSort(chineseWordAry) {
    const letters = "*abcdefghjklmnopqrstwxyz".split('');
    const zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');

    let segs = [];
    let curr;

    letters.forEach((character, i) => {
        curr = {
            letter: character,
            data: []
        };

        chineseWordAry.forEach((word, j) => {
            let w = word.charAt(0);
            if ((!zh[i-1] || zh[i-1].localeCompare(w,"zh-Hans-CN") <= 0) && w.localeCompare(zh[i],"zh-Hans-CN") == -1){
                curr.data.push(word);
            }
        });

        if (curr.data.length) {
            curr.data.sort((a, b) => {
                return a.localeCompare(b, "zh-Hans-CN");
            });
            segs.push(curr);
        }
    });

     return segs;
}

function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export {
    loadAvatar,
    dataURItoBlob,
    pySegSort,
    uniquePageId,
    guid
}