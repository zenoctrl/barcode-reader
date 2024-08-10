// Check if Barcode Detection API is available
if ("BarcodeDetector" in window) {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const resultDiv = document.getElementById("result");
  const canvasCtx = canvas.getContext("2d");

  // Initialize the BarcodeDetector
  const barcodeDetector = new BarcodeDetector({
    formats: ["barcode_128", "ean_13"],
  });

  // Function to start the camera and capture video
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();
      detectBarcode();
    } catch (error) {
      console.error("Error accessing camera:", error);
      resultDiv.textContent =
        "Error accessing camera. Please check your permissions.";
    }
  }

  // Function to detect barcode from video feed
  async function detectBarcode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const barcodes = await barcodeDetector.detect(canvas);
        if (barcodes.length > 0) {
          resultDiv.textContent = `Scanned Barcode: ${barcodes[0].rawValue}`;
        } else {
          resultDiv.textContent = "No barcode detected";
        }
      } catch (error) {
        console.error("Error detecting barcode:", error);
        resultDiv.textContent = "Error detecting barcode";
      }
    }

    // Continuously check for barcode
    requestAnimationFrame(detectBarcode);
  }

  // Start the camera when the page loads
  window.addEventListener("load", startCamera);
} else {
  console.log("Barcode Detection API is not supported in this browser.");
  document.getElementById("result").textContent =
    "Barcode Detection API is not supported in this browser.";
}
