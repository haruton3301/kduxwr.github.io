function onOpenCvReady() {
  //alert("opencv loaded");
  document.getElementById("loading").style.display = "none";
}

let video;
(function () {
  if (!navigator.mediaDevices) {
    alert("すみません。あなたの端末では動作しません。");
    return;
  }
  video = document.getElementById('video');
  let constraints = {
    audio: false,
    video: {
      facingMode: 'environment'
    }
  };
  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      video.srcObject = stream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
    })
    .catch((err) => {
      window.alert(err.name + ': ' + err.message);
    });
}());

function snapshot() {
  video.pause();

  let canvas = document.getElementById("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let canvasCtx = canvas.getContext('2d');
  canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

  let dataURI = canvas.toDataURL("image/jpeg");
  let imgElem = document.createElement("img");
  imgElem.setAttribute("src", dataURI);
  imgElem.style.display = "none";
  document.body.appendChild(imgElem);

  imgElem.onload = function () {
    let rgb = cv.imread(imgElem);

    let mycv = new MyCVTools(rgb);

    mycv.binarize(); //２値化

    mycv.trimMaxRect(); //トリミング

    let result = mycv.getResult(); //結果を取得

    cv.imshow('canvasOutput', result);

    canvasOutput = document.getElementById("canvasOutput");
    let dataURI = canvasOutput.toDataURL("image/png");
    sessionStorage.textureImage = dataURI;

    mycv.endProcess(); //終了処理

    window.location.href = 'ar-view.html'; //ページを遷移

  }
}