import "./App.css";
import { SpeechRecognition } from "./features/speech-recognition/";
import { InternetAccessMessage } from "./features/ui";
import { HomepageMessage } from "./features/ui/";
import { useEffect } from "react";

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

  useEffect(() => {
    getMedia({ audio: true });
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
    </>
  );
}

export default App;
