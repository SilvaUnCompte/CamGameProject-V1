// function: launch webcam
function captureWebcam() {
    capture = createCapture(
      {
        audio: false,
        video: {
          facingMode: "user",
        },
      },
      function (e) {
        captureEvent = e;
        console.log(captureEvent.getTracks()[0].getSettings());
        // do things when video ready
        // until then, the video element will have no dimensions, or default 640x480
        capture.srcObject = e;
  
        setCameraDimensions(capture);
        mediaPipe.predictWebcam(capture);
      }
    );
    capture.elt.setAttribute("playsinline", "");
    capture.hide();
  }
  
  // function: resize webcam depending on orientation
  function setCameraDimensions(video) {
  
    const vidAspectRatio = video.width / video.height; // aspect ratio of the video
    const canvasAspectRatio = width / height; // aspect ratio of the canvas
  
    if (vidAspectRatio > canvasAspectRatio) {
      // Image is wider than canvas aspect ratio
      video.scaledHeight = height;
      video.scaledWidth = video.scaledHeight * vidAspectRatio;
    } else {
      // Image is taller than canvas aspect ratio
      video.scaledWidth = width;
      video.scaledHeight = video.scaledWidth / vidAspectRatio;
    }
  }
  
  
  // function: center our stuff
  function centerOurStuff() {
    translate(width / 2 - capture.scaledWidth / 2, height / 2 - capture.scaledHeight / 2); // center the webcam
  }
  
  // function: window resize
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setCameraDimensions(capture);
  }
  
  