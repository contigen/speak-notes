import { useRef, useEffect, useCallback } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import firstAudioUrl from "../../sounds/audio-start.mp3";
import secondAudioUrl from "../../sounds/audio-end.mp3";

export const SpeechRecognition = () => {
  const {
    browserSupport,
    transcript,
    setTranscript: handleChange,
    speechErrMessage,
    startSpeechRec,
    stopSpeechRec,
    noMatch,
    listening,
    transcriptRef,
    clickedRef,
  } = useSpeechRecognition();

  const linkRef = useRef();
  // avoid recreating audio objects on every rerender: create once, use till the component is destroyed
  const audioStartRef = useRef(new Audio(firstAudioUrl));
  const audioEndRef = useRef(new Audio(secondAudioUrl));

  const playSpeechRec = () => {
    if (!clickedRef.current) {
      audioStartRef.current.play();
    }
    startSpeechRec();
  };
  const stopSpeechRecognition = () => {
    if (audioStartRef.current.ended && clickedRef.current) {
      audioEndRef.current.play();
    }
    stopSpeechRec();
  };
  const downloadTranscript = useCallback(() => {
    let blob = new Blob([transcript.split(`.`).join(`\n`)], {
      type: `text/plain`,
    });
    linkRef.current.href = URL.createObjectURL(blob);
  }, [transcript]);
  useEffect(() => {
    return () => URL.revokeObjectURL(linkRef.current?.href);
  }, []);
  if (!browserSupport) {
    return (
      <p>
        Your browser lacks support for the Web Speech Recognition service,
        sorry.
      </p>
    );
  }
  return (
    <section>
      <button onClick={playSpeechRec}>
        {!listening ? `Start listening` : `listening ...`}
      </button>
      <button onClick={stopSpeechRecognition}>
        Stop Speech Recognition service
      </button>
      {transcript ? (
        <div>
          <br />
          <div>
            <p>{transcriptRef.current}</p>
            <textarea
              value={transcript}
              onChange={({ target: { value } }) => handleChange(value)}
            ></textarea>
            {noMatch && <p>Not very loud, let's hear it again ...</p>}
            <p style={{ textAlign: `center` }}>
              Your voice is being recorded in <b>{navigator.language}</b>
            </p>
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
