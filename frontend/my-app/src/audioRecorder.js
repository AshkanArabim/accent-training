// import {MediaRecorder, register} from 'extendable-media-recorder';
// import {connect} from 'extendable-media-recorder-wav-encoder';
export let blob;

export function record(onRecordingStop) {
  if (!navigator.mediaDevices) {
    console.error("getUserMedia not supported.");
    return;
  }

  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      let chunks = [];
      let recorder = new MediaRecorder(stream);

      recorder.ondataavailable = event => {
        chunks.push(event.data);
      };

      recorder.onstop = event => {
        console.log("Recording stopped.");
        blob = new Blob(chunks, { type: recorder.mimeType });
        chunks = [];

        // Trigger the callback function passed in to handle flip
        if (onRecordingStop) {
          onRecordingStop();
        }
      };

      recorder.onstart = event => {
        console.log("Recording started.");
        setTimeout(function () {
          recorder.stop(); 
        }, 3000);  // 3 seconds recording
      };

      recorder.start();
    })
    .catch(function (err) {
      console.error(err);
    });
}

        // fetch(uploadURL, {
        //     method: "POST",
        //     cache: "no-cache",
        //     body: formData
        // }).then(resp => {
        //     if (resp.status === 200) {
        //     window.location.reload(true);
        //     } else {
        //     console.error("Error:", resp)
        //     }
        // }).catch(err => {
        //     console.error(err);
        // });
 
