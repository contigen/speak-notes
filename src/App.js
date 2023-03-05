import "./App.css";
import { SpeechRecognition } from "./features/speech-recognition/";
import { InternetAccessMessage } from "./features/ui";
import { HomepageMessage } from "./features/ui/";

function App() {
  if (!(`webkitSpeechRecognition` in window || `SpeechRecognition` in window)) {
    return <HomepageMessage browserSupport={false} />;
  }
  return (
    <>
      <HomepageMessage browserSupport />
      <SpeechRecognition />
      <InternetAccessMessage />
    </>
  );
}

export default App;
