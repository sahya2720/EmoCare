const video = document.getElementById("video");
const emotionText = document.getElementById("emotion");

// Load face-api models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    });
}

// Detect emotion every 5 seconds
setInterval(async () => {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detection) {
    const expressions = detection.expressions;
    const dominantEmotion = Object.keys(expressions)
      .reduce((a, b) => expressions[a] > expressions[b] ? a : b);

    emotionText.innerText = "Detected Emotion: " + dominantEmotion;
    currentFaceEmotion = dominantEmotion;
  }
}, 5000);

let currentFaceEmotion = "neutral";
function analyzeTextEmotion(text) {
  text = text.toLowerCase();

  if (text.includes("sad") || text.includes("tired") || text.includes("depressed"))
    return "sad";

  if (text.includes("angry") || text.includes("frustrated"))
    return "angry";

  if (text.includes("happy") || text.includes("good"))
    return "happy";

  return "neutral";
}
