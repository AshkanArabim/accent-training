// import {MediaRecorder, register} from 'extendable-media-recorder';
// import {connect} from 'extendable-media-recorder-wav-encoder';
export let blob;

export function record() {
const uploadURL = "{{ url_for('audio_upload') }}";
const startButton = document.getElementById("toggle-rec-btn");
startButton.addEventListener("click", function() {
    if (!navigator.mediaDevices) {
    console.error("getUserMedia not supported.")
    return;
    }

    const constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
        let chunks = []
        let recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => {
            chunks.push(event.data);
        };
        recorder.onstop = event => {
        console.log("Recording stopped.")
        blob = new Blob(chunks, { type: recorder.mimeType }); 
        chunks = [];
        startButton.disabled = false;

        let formData = new FormData();
        formData.append('audio_file', blob);

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
        };
        recorder.onstart = event => {
        console.log("Recording started.");
        startButton.disabled = true;
        setTimeout(function() { recorder.stop(); }, 5000);
        };
        recorder.start();
    })
    .catch(function(err) {
        console.error(err);
    });
});
};

// let mediaRecorder = null;
// let audioBlobs = [];
// let capturedStream = null;

// // Register the extendable-media-recorder-wav-encoder
// async connect() {
//   await register(await connect());
// }

// // Starts recording audio
// function startRecording() {

//   return navigator.mediaDevices.getUserMedia({
//     audio: {
//       echoCancellation: true,
//     }
//   }).then(stream => {
//       audioBlobs = [];
//       capturedStream = stream;

//       // Use the extended MediaRecorder library
//       mediaRecorder = new MediaRecorder(stream, {
//         mimeType: 'audio/wav'
//       });

//       // Add audio blobs while recording 
//       mediaRecorder.addEventListener('dataavailable', event => {
//         audioBlobs.push(event.data);
//       });

//       mediaRecorder.start();
//   }).catch((e) => {
//     console.error(e);
//   });

// }

// function stopRecording() {
//     return new Promise(resolve => {
//       if (!mediaRecorder) {
//         resolve(null);
//         return;
//       }
  
//       mediaRecorder.addEventListener('stop', () => {
//         const mimeType = mediaRecorder.mimeType;
//         const audioBlob = new Blob(audioBlobs, { type: mimeType });
  
//         if (capturedStream) {
//           capturedStream.getTracks().forEach(track => track.stop());
//         }
  
//         resolve(audioBlob);
//       });
      
//       mediaRecorder.stop();
      
//     });
// }

// playAudio(audioBlob) {
//     if (audioBlob) {
//       const audio = new Audio();
//       audio.src = URL.createObjectURL(audioBlob);
//       audio.play();
//     }
// }