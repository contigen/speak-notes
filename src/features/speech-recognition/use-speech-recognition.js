import { useLayoutEffect, useState } from "react";

export function useSpeechRecognition() {
  const [browserSupport, setBrowserSupport] = useState(true);
  const [transcript, setTranscript] = useState(``);
  const [speechErrMessage, setSpeechErrMessage] = useState(``);
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const Recognition = new window.SpeechRecognition();
  Recognition.continuous = true;
  Recognition.interimResults = true;

  const startSpeechRec = () => Recognition.start();
  const stopSpeechRec = () => {
    Recognition.stop();
  };
  Recognition.onresult = (evt) => {
    const speechRecResult = evt.results;
    [...speechRecResult]
      // eslint-disable-next-line array-callback-return
      .map((currentSpeechRec) => {
        // setTranscript(
        //   (prevValue) => prevValue + currentSpeechRec[0].transcript
        // );
        setTranscript(currentSpeechRec[0].transcript);
      })
      .join(" ");
  };
  Recognition.onend = () => {
    Recognition.start();
  };
  Recognition.onerror = (evt) => {
    setSpeechErrMessage(evt.error);
  };

  useLayoutEffect(() => {
    if (!(`SpeechRecognition` in window)) {
      setBrowserSupport(false);
    }
  }, [setBrowserSupport]);
  return {
    browserSupport,
    transcript,
    speechErrMessage,
    startSpeechRec,
    stopSpeechRec,
  };
}
