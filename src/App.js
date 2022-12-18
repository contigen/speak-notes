import "./App.css";
import { SpeechRecognition } from "./features/speech-recognition/";

function App() {
  return (
    <>
      <h1>Speak-notes: A Speech Recognition App</h1>
      <p>
        The App accesses your microphone, if you permit apparently. <b>*</b>No
        user data stored.
      </p>
      <h3>Speak • Transcribe - edit transcript • Download transcript.</h3>
      <SpeechRecognition />
    </>
  );
}

export default App;
