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
    abortSpeechRec,
  } = useSpeechRecognition();

  const linkRef = useRef();
  const ref = useRef();
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
  const focusHandler = (evt) => {
    if (!evt.currentTarget.contains(evt.relatedTarget)) {
      console.log(`focused`);
    }
  };
  const blurHandler = (evt) => {
    if (!evt.currentTarget.contains(evt.relatedTarget)) {
      console.log(`blurred`);
    }
  };
  useEffect(() => {
    const sectionElement = ref.current;
    sectionElement.addEventListener(`focusout`, blurHandler);
    const linkElement = linkRef.current;
    return () => {
      sectionElement.removeEventListener(`focusout`, blurHandler);

      if (linkElement?.getAttribute(`href`) !== `#`) {
        URL.revokeObjectURL(linkElement?.href);
      }
    };
  }, []);

  return (
    <section onFocus={focusHandler} onBlur={blurHandler} ref={ref}>
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
