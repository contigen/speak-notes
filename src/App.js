import "./App.css";
import { useState, useEffect } from "react";
import { SpeechRecognition } from "./features/speech-recognition/";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    window.addEventListener(`online`, () => {
      setIsOnline(true);
    });
    window.addEventListener(`offline`, () => {
      setIsOnline(false);
    });
  }, []);
  return (
    <>
      <h1>Speak-notes: A Speech Recognition App</h1>
      <p>
        The App accesses your microphone, if you permit apparently. <b>*</b>No
        user data stored.
      </p>
      <h3>Speak • Transcribe - edit transcript • Download transcript.</h3>
      {!isOnline && (
        <p style={{ textAlign: `center` }}>
          <b>App requires internet access</b>
        </p>
      )}
      <SpeechRecognition />
    </>
  );
}

export default App;
