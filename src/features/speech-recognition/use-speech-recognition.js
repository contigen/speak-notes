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
  const addToTranscript = (speechRecTranscript) => {
    setTranscript((prevValue) => {
      if (!prevValue) {
        return speechRecTranscript;
      } else {
        return prevValue + speechRecTranscript.slice(prevValue.length);
      }
    });
  };
  Recognition.onresult = (evt) => {
    const speechRecResult = evt.results;
    [...speechRecResult].forEach((currentSpeechRec) => {
      console.log(currentSpeechRec[0].transcript);
      addToTranscript(currentSpeechRec[0].transcript);
    });
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
    setTranscript,
    speechErrMessage,
    startSpeechRec,
    stopSpeechRec,
  };
}
