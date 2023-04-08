import { useState } from "react";
import "./App.css";
import { SpeechRecognition } from "./features/speech-recognition/";
import { InternetAccessMessage } from "./features/ui";
import { HomepageMessage } from "./features/ui/";

function App() {
  const [noteCount, setNoteCount] = useState([1]);
  if (!(`webkitSpeechRecognition` in window || `SpeechRecognition` in window)) {
    return <HomepageMessage browserSupport={false} />;
  }
  const createSpeakNote = () => {
    setNoteCount((prev) => [...prev, 1]);
  };
  const deleteSpeakNote = () => {
    if (noteCount.length === 1) return;
    setNoteCount((prev) => prev.slice(0, -1));
  };
  return (
    <>
      <HomepageMessage browserSupport />
      <button onClick={createSpeakNote}>Add note</button>
      <button onClick={deleteSpeakNote}>Delete note</button>
      {noteCount.map((_, idx) => (
        <SpeechRecognition key={idx} />
      ))}
      <InternetAccessMessage />
      <pre>copy functionality</pre>
      <code>Add tags to notes</code>
      <pre>Sort notes based on tags and create time</pre>
      <pre>Create tags, and reference it in own notes</pre>
      <pre>A folder of same tag notes</pre>
      <h3>Heading of notes with option to select tag</h3>
      <code>Search all notes functionality</code>
      <hr />
      <kbd>
        Keyboard shortcuts to control specific functionalities: open tags menu,
        copy notes: bolden and italicise text
      </kbd>
      <p>
        <small>Voice commands</small>
      </p>
    </>
  );
}

export default App;
