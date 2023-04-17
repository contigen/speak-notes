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
  const timestampRef = useRef(Array(1));
  const [copyBtnText, setCopyBtnText] = useState(`Copy Transcript`);

  const generateBlob = useCallback(() => {
    const blob = new Blob([transcript.note.split(`.`).join(`\n`)], {
      type: `text/plain`,
    });
    return blob;
  }, [transcript.note]);
  const createFile = useCallback(() => {
    const blob = generateBlob();
    const file = new File([blob], `transcript.txt`, {
      type: `text/plain`,
    });
    return file;
  }, [generateBlob]);
  const downloadTranscript = useCallback(() => {
    const blob = generateBlob();
    linkRef.current.href = URL.createObjectURL(blob);
  }, [generateBlob]);
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
  const shareTranscript = async () => {
    const file = createFile();
    const shareData = {
      title: `Speak-Notes`,
      url: `https://speak-notes.pages.dev`,
      files: [file],
    };
    try {
      await navigator.share(shareData);
      setShareData(`Transcript shared!`);
    } catch {
      setShareData(`Couldn't share transcript`);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShareData(``);
  };
  const copyTranscript = async () => {
    await navigator.clipboard.writeText(transcript.note);
    setCopyBtnText(`Copied to clipboard!`);
    setTimeout(() => {
      setCopyBtnText(`Copy Transcript`);
    }, 1000);
  };
  const handleChange = ({ timeStamp, target: { value } }) => {
    const KEY_PRESS_TIME_DIFF = 200;
    if (timestampRef.current[0]) {
      const timeDiff = timeStamp - timestampRef.current[0];
      // react's onChange event triggers on every single change; undoTranscript() & redoTranscript() shouldn't, check if change was made within a certain time frame
      timeDiff > KEY_PRESS_TIME_DIFF && valueRef.current.push(value);
    } else {
      valueRef.current.push(value);
    }
    timestampRef.current[0] = timeStamp;
    idxRef.current = valueRef.current.length - 1;
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
              <Button onClick={copyTranscript}>{copyBtnText}</Button>
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
