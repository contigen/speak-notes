import "./App.css";
import { SpeechRecognition } from "./features/speech-recognition/";
import { InternetAccessMessage } from "./features/ui";
import { HomepageMessage } from "./features/ui/";
import { useEffect, useRef } from "react";

function App() {
  async function getMedia(constraints) {
    if (!(`webkitSpeechRecognition` in window || `SpeechRecognition` in window))
      return;
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.log(err);
    }
    return stream;
  }
  if (`webkitSpeechRecognition` in window || `SpeechRecognition` in window) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { facingMode: `user` },
      })
      .then((mediaStream) => {
        const audio = document.querySelector(`audio`);
        const video = document.querySelector(`video`);
        audio.srcObject = mediaStream;
        video.srcObject = mediaStream;
        // audio.onloadedmetadata = () => audio.play();
        video.onloadedmetadata = () => video.play();
      })
      .catch((err) => console.log(err.name, err.message));
  }
  const ref = useRef();
  useEffect(() => {
    getMedia({ audio: true });
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          useRef.current = (
            <span>
              (`${device.kind}: ${device.label} id = ${device.deviceId}`)
            </span>
          );
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  });

  if (!(`webkitSpeechRecognition` in window || `SpeechRecognition` in window)) {
    return <HomepageMessage browserSupport={false} />;
  }
  return (
    <>
      <HomepageMessage browserSupport />
      <SpeechRecognition />
      <InternetAccessMessage />
      <audio id="video" controls></audio>
      <video id="video" controls></video>
      <button>{useRef.current ?? `no value`}</button>
    </>
  );
}

export default App;
