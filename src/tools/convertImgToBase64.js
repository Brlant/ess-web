const convertImgToBase64 = (imageFile, callback) => {
  let reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = function (e) {
      if (callback) {
        let base64Str = e.target.result;
        callback(base64Str);
      }
    };
}

export default convertImgToBase64