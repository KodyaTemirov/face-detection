export const imageURLtoBlob = async (url) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.onload = function() {
        if (xhr.status === 200) {
          let blob = new Blob([xhr.response], { type: xhr.getResponseHeader('Content-Type') });
          let file = new File([blob], 'new_image.jpg', { type: blob.type });

          let img = new Image();

          img.onload = function() {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            context.drawImage(img, 0, 0);

            let base64Image = canvas.toDataURL('image/jpeg');

            resolve({ base64Image, file });
          };

          img.src = URL.createObjectURL(blob);
          img.crossOrigin = 'anonymous';
        } else {
          reject(new Error(`Failed to load image: ${url}`));
        }
      };

      xhr.responseType = 'arraybuffer';
      xhr.open('GET', url, true);
      xhr.send();
    });
}