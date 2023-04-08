import { useRef, useEffect, useCallback } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { Button } from "../ui/button";
import { TextArea } from "../ui/textarea";
export const SpeechRecognition = () => {
  const {
    transcript,
    setTranscript,
    speechErrMessage,
    startSpeechRec,
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
    setTranscript((prev) => ({ ...prev, note: value }));
  };
  const handleFocus = ({ currentTarget, relatedTarget, target }) => {
    // avoid focus event triggering more than once within the same element
    if (!currentTarget.contains(relatedTarget)) {
      // focusRef.current = true;
      // click event doesn't work simultaneously with blur, use focus event with .click()
      target.click();
    }
  };
  const handleBlur = ({ currentTarget, relatedTarget }) => {
    // avoid blur event triggering more than once within the same element
    if (!currentTarget.contains(relatedTarget)) {
      stopSpeechRec(null, false);
    }
  };
  useEffect(() => {
    const linkElement = linkRef.current;
    return () => {
      if (linkElement?.getAttribute(`href`) !== `#`) {
        URL.revokeObjectURL(linkElement?.href);
      }
    };
  }, []);

  return (
    <section onFocus={handleFocus} onBlur={handleBlur}>
      {!transcript.listening && (
        <Button>
          <b>{navigator.language}</b>
        </Button>
      )}
      <Button onClick={startSpeechRec}>
        {transcript.listening ? `Listening ...` : `Start listening`}
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
            />
            {transcript.noMatch && (
              <p>Not very loud, let's hear it again ...</p>
            )}
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
        speechErrMessage &&
        !transcript.preview && (
          <h3>Error occurred in recognising speech: {speechErrMessage}</h3>
        )
      )}
      {transcript.listening && (
        <p style={{ textAlign: `center` }}>
          Listening to your voice in <b>{navigator.language}</b>
        </p>
      )}
    </section>
  );
};
