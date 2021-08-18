var video = document.getElementById('video');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

function startVideo() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log('Something went wrong!');
      });
  }
}

var firstStart = true;
var displaySize = { width: video.width, height: video.height };

video.addEventListener('playing', () => {
  var canvas;
  if (firstStart) {
    canvas = faceapi.createCanvasFromMedia(video, displaySize);
    document.getElementById('video-holder').append(canvas);
    firstStart = false;
  } else {
    canvas = document.getElementById('video-holder').childNodes[1];
  }

  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    var detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    var resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});

var playBtn = document.getElementById('play-button');

playBtn.addEventListener('click', function () {
  var button = $(this);
  if (button.text() == 'Pause') {
    $('video').each(function () {
      $(this).get(0).pause();
    });
    button.text('Run');
    $('.startstop').text('start');
    $('.stopstart').text('stop');
  } else {
    $('video').each(function () {
      $(this).get(0).play();
    });
    button.text('Pause');
    $('.startstop').text('stop');
    $('.stopstart').text('start');
  }
});
