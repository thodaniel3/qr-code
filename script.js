const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const output = document.getElementById("output");
const context = canvas.getContext("2d");

// Access back camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" } // back camera
    });
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
    requestAnimationFrame(scanQRCode);
  } catch (err) {
    output.textContent = "Error accessing camera: " + err;
  }
}

// Scan QR code continuously
function scanQRCode() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      output.textContent = "QR Code detected: " + code.data;
      // Optionally stop scanning after detecting one
      // video.srcObject.getTracks().forEach(track => track.stop());
      // return;
    } else {
      output.textContent = "Scanning for QR code...";
    }
  }

  requestAnimationFrame(scanQRCode);
}

// Start camera on page load
startCamera();
