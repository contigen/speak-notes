import "./App.css";
import { SpeechRecognition } from "./features/speech-recognition/";
import { InternetAccessMessage } from "./features/ui";
import { HomepageMessage } from "./features/ui/";
import { useEffect, useCallback } from "react";

function App() {
  async function getMedia(constraints) {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.log(err);
    }
    return stream;
  }
  const mediaRecord = useCallback(
    () =>
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((mediaStream) => {
          const audio = document.querySelector(`audio`);
          audio.srcObject = mediaStream;
          audio.onloadedmetadata = () => audio.play();
        })
        .catch((err) => console.log(err.name, err.message)),
    []
  );
  useEffect(() => {
    // getMedia({ audio: true });
  }, []);

  if (!(`webkitSpeechRecognition` in window || `SpeechRecognition` in window)) {
    return <HomepageMessage browserSupport={false} />;
  }
  return (
    <>
      <HomepageMessage browserSupport />
      <SpeechRecognition />
      <InternetAccessMessage />
      <audio id="video" controls></audio>
      <button onClick={mediaRecord}>Start media recording</button>
    </>
  );
}

export default App;
