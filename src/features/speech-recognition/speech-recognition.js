import { useRef, useEffect, useState, useCallback } from "react";
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

  const [dirty, setDirty] = useState({
    undo: false,
    redo: false,
  });
  const [shareData, setShareData] = useState(``);
  const textareaRef = useRef();
  const linkRef = useRef();
  const valueRef = useRef([]);
  const idxRef = useRef(0);
  const timeStampRef = useRef([]);

  const downloadTranscript = useCallback(() => {
    const blob = new Blob([transcript.note.split(`.`).join(`\n`)], {
      type: `text/plain`,
    });
    linkRef.current.href = URL.createObjectURL(blob);
  }, [transcript]);
  const undoTranscript = () => {
    if (idxRef.current === 0) return;
    setDirty((prevState) => ({ ...prevState, redo: true }));
    setTranscript((prevState) => ({
      ...prevState,
      note: valueRef.current[idxRef.current],
    }));
    --idxRef.current;
  };
  const redoTranscript = () => {
    if (idxRef.current === valueRef.current.length) return;
    setTranscript((prevState) => ({
      ...prevState,
      note: valueRef.current[idxRef.current],
    }));
    ++idxRef.current;
  };
  const handleChange = ({ timeStamp, target: { value } }) => {
    const KEY_PRESS_TIME_DIFF = 200;
    if (timeStampRef.current.length > 1) {
      const timeDiff =
        timeStampRef.current.at(-1) - timeStampRef.current.at(-2);
      timeDiff > KEY_PRESS_TIME_DIFF && valueRef.current.push(value);
    }
    timeStampRef.current.push(timeStamp);
    idxRef.current = valueRef.current.length - 1;
    timeStampRef.current.length === 1 && valueRef.current.push(value);
    setTranscript((prev) => ({ ...prev, note: value }));
    setDirty((prevState) => ({ ...prevState, undo: true }));
  };
  const handleFocus = ({ currentTarget, relatedTarget, target }) => {
    // avoid focus event triggering more than once within the same element
    if (!currentTarget.contains(relatedTarget)) {
      // if blur event is triggered by clicking a separate element, only blur event is triggered, the click event isn't, use focus event with .click() to run the click event's handler almost simultaneously or sequentially
      target.click();
    }
  };
  const handleBlur = ({ currentTarget, relatedTarget, target }) => {
    // avoid blur event triggering more than once within the same element
    if (!currentTarget.contains(relatedTarget)) {
      const regExpValue = new RegExp(target.innerText, `i`);
      const isSameTag = target.tagName === relatedTarget?.tagName;
      const isSameElement =
        isSameTag &&
        // innerText of element changes
        relatedTarget?.innerText.match(regExpValue);
      // if blur event was triggered by focus event calling startSpeechRec() through .click(), don't play audioEnd
      stopSpeechRec(null, isSameElement);
    }
  };
  const shareTranscript = async () => {
    const shareData = {
      title: `Speak-Notes`,
      text: transcript.note,
      url: `https://speak-notes.pages.dev`,
    };
    try {
      await navigator.share(shareData);
      setShareData(`Transcript shared!`);
    } catch (err) {
      setShareData(`Couldn't share transcript: ${err}`);
    }
  };
  useEffect(() => {
    if (idxRef.current === valueRef.current.length - 1) {
      setDirty((prevState) => ({ ...prevState, redo: false }));
      return;
    }
    if (idxRef.current < 1) {
      setDirty((prevState) => ({ ...prevState, undo: false }));
      return;
    }
  }, [transcript.note]);
  useEffect(() => {
    const linkElement = linkRef.current;
    if (!navigator.canShare) {
      setShareData(`Your browser doesn't support the Web Share API.`);
    }
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
        {transcript.listening ? `Listening` : `Start listening`}
      </Button>
      <Button onClick={stopSpeechRec}>Stop speech recognition service</Button>
      <p>{transcript.preview}</p>
      {transcript.note || dirty.undo ? (
        <div>
          <br />
          <div>
            <TextArea
              value={transcript.note}
              onChange={handleChange}
              ref={textareaRef}
            />
            <div style={{ textAlign: `center`, marginBlock: `1rem` }}>
              <Button onClick={undoTranscript} disabled={!dirty.undo}>
                Undo
              </Button>
              <Button onClick={redoTranscript} disabled={!dirty.redo}>
                Redo
              </Button>
              <Button onClick={shareTranscript}>Share Transcript</Button>
              <p>{shareData}</p>
            </div>
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
