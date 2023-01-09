import { useRef, useEffect, useCallback } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { Button } from "../ui/button";
import { TextArea } from "../ui/textarea";
export const SpeechRecognition = () => {
  const {
    browserSupport,
    transcript,
    setTranscript,
    speechErrMessage,
    startSpeechRec,
    speechRecVarsRef,
    stopSpeechRec,
  } = useSpeechRecognition();

  const linkRef = useRef();
  const downloadTranscript = useCallback(() => {
    const blob = new Blob([transcript.note.split(`.`).join(`\n`)], {
      type: `text/plain`,
    });
    linkRef.current.href = URL.createObjectURL(blob);
  }, [transcript]);
  const handleChange = (value) => {
    setTranscript((prev) => {
      return { ...prev, note: value };
    });
  };
  useEffect(() => {
    const linkElement = linkRef.current;
    return () => {
      if (linkElement?.getAttribute(`href`) !== `#`) {
        URL.revokeObjectURL(linkElement?.href);
      }
    };
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
      <Button onClick={startSpeechRec}>
        {speechRecVarsRef.current.listening
          ? `Listening ...`
          : `Start listening`}
      </Button>
      <Button onClick={stopSpeechRec}>Stop speech recognition service</Button>
      <p>{transcript.preview}</p>
      {transcript.note ? (
        <div>
          <br />
          <div>
            <TextArea
              value={transcript.note}
              onChange={({ target: { value } }) => handleChange(value)}
            ></TextArea>
            {speechRecVarsRef.current.noMatch && (
              <p>Not very loud, let's hear it again ...</p>
            )}
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
