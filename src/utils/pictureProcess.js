/**
 * 读取图片文件获取对应base64
 * @param img 图片文件
 * @param callback 回调
 */
export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 * 裁剪icon logo图片
 */
export function cropIconToBase64(img, callback, max_width = 120) {
  getBase64(img, res => {
    scaleCanvas(res, max_width, (data) => {
      clipSquareCanvas(data, base64 => callback(base64));
    });
  });
}

/**
 * 裁剪成正方形
 */
function clipSquareCanvas(url, callback) {
  let img = new Image();
  img.src = url;
  img.onload = function () {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    let eLength = Math.min(this.width, this.height);
    canvas.width = eLength;
    canvas.height = eLength;
    ctx.drawImage(this, (this.width - eLength) / 2, (this.height - eLength) / 2, eLength, eLength, 0, 0, eLength, eLength);
    let base64 = canvas.toDataURL('image/jpeg', 1);  // 这里的“1”是指的是处理图片的清晰度（0-1）之间，当然越小图片越模糊，处理后的图片大小也就越小
    callback && callback(base64)      // 回调base64字符串
  }
}

/**
 * 缩放
 */
function scaleCanvas(url, max_width, callback) {
  let img = new Image();
  img.src = url;
  img.onload = function () {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    let eLength = Math.min(this.width, this.height, max_width);

    if (eLength == max_width) {
      let ratio = this.width / this.height;

      if (this.width > this.height) {
        canvas.width = eLength * ratio;
        canvas.height = eLength;
      } else {
        canvas.width = eLength;
        canvas.height = eLength / ratio;
      }
    } else {
      canvas.width = this.width;
      canvas.height = this.height;
    }

    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    let base64 = canvas.toDataURL('image/jpeg', 1);  // 这里的“1”是指的是处理图片的清晰度（0-1）之间，当然越小图片越模糊，处理后的图片大小也就越小
    callback && callback(base64)      // 回调base64字符串
  }
}
