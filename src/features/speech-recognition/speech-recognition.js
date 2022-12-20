import { useRef, useEffect, useCallback } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { BrowserList } from "../ui/";

export const SpeechRecognition = () => {
  const {
    browserSupport,
    transcript,
    setTranscript,
    speechErrMessage,
    startSpeechRec,
  } = useSpeechRecognition();
  const linkRef = useRef();
  const downloadTranscript = useCallback(() => {
    let blob = new Blob([transcript], { type: `text/plain` });
    linkRef.current.href = URL.createObjectURL(blob);
  }, [transcript]);
  useEffect(() => {
    return () => URL.revokeObjectURL(linkRef.current?.href);
  }, []);
  const addToTranscript = (string) => {
    setTranscript((prevValue) => prevValue + string);
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
          <div>
            <textarea
              style={{
                width: `100%`,
                resize: `vertical`,
                fontWeight: 500,
                fontSize: `1rem`,
              }}
              value={transcript}
              onChange={(ev) => setTranscript(ev.target.value)}
            ></textarea>
          </div>
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
        speechErrMessage && (
          <h3>Error occurred in recognising speech: {speechErrMessage}</h3>
        )
      )}
    </section>
  );
};
