import {MediaRecorder, register} from 'extendable-media-recorder';
import {connect} from 'extendable-media-recorder-wav-encoder';

export let blob;

await register(await connect());

export async function record(onRecordingStop) {
  if (!navigator.mediaDevices) {
    console.error("getUserMedia not supported.");
    return;
  }

  const constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      let chunks = [];
      let recorder = new MediaRecorder(stream,{
        mimeType: 'audio/wav'
      });

      const audioContext = new AudioContext({ sampleRate: 16000 });
      const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(audioContext, { mediaStream: stream });
      const mediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode(audioContext);

      mediaStreamAudioSourceNode.connect(mediaStreamAudioDestinationNode);

      recorder = new MediaRecorder(mediaStreamAudioDestinationNode.stream, {mimeType: 'audio/wav'});

      recorder.ondataavailable = event => {
        chunks.push(event.data);
      };

      recorder.onstop = async event =>  {
        console.log("Recording stopped.");
        blob = new Blob(chunks, { type: recorder.mimeType });
        chunks = [];

        let formData = new FormData();
        formData.append('audio_file', blob);

        const response = await fetch(`http://127.0.0.1:5000/aud2ipa`, {
                method: "POST",
                cache: "no-cache",
                body: formData
            }).then(resp => {
                if (resp.status !== 200) {
                    console.error("Error:", resp)
                }
            }).catch(err => {
                console.error(err);
            });
        
        console.log(response)
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

 
