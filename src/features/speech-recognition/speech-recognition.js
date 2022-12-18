import { useRef } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { BrowserList } from "../ui/";

export const SpeechRecognition = () => {
  const { browserSupport, transcript, speechErrMessage, startSpeechRec } =
    useSpeechRecognition();
  const linkRef = useRef();
  const downloadTranscript = () => {
    let blob = new Blob([transcript], { type: `text/plain` });
    linkRef.current.href = URL.createObjectURL(blob);
  };
  if (!browserSupport) {
    return (
      <>
        <h3>Your browser is not supported</h3>
        <BrowserList />
      </>
    );
  }
  return (
    <section>
      <button onClick={startSpeechRec}>Start listening</button>
      {!!transcript ? (
        <div>
          <h4 contentEditable>{transcript}</h4>
          <p>{speechErrMessage}</p>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            download="transcript.txt"
            onClick={downloadTranscript}
            ref={linkRef}
          >
            Download transcript
          </a>
        </div>
      ) : (
        <h3>Error occurred in recognising speech: {speechErrMessage}</h3>
      )}
    </section>
  );
};
