import { useLayoutEffect, useState, useRef } from "react";
import firstAudioUrl from "../../sounds/audio-start.mp3";
import secondAudioUrl from "../../sounds/audio-end.mp3";

export function useSpeechRecognition() {
  const [browserSupport, setBrowserSupport] = useState(true);
  const [transcript, setTranscript] = useState(``);
  const [speechErrMessage, setSpeechErrMessage] = useState(``);

  const Recognition =
    new window.webkitSpeechRecognition() || new window.SpeechRecognition();

  const speechRecVarsRef = useRef({
    clicked: false,
    transcript: ``,
    noMatch: false,
    listening: false,
  });
  const audioStart = new Audio(firstAudioUrl);
  const audioEnd = new Audio(secondAudioUrl);
  const startSpeechRec = () => {
    // calling Recognition.start() more than once throws an error
    if (!speechRecVarsRef.current.clicked) {
      Recognition.start();
      audioStart.play();
    }
    speechRecVarsRef.current.clicked = true;
  };
  const stopSpeechRec = () => {
    audioStart.pause();
    audioStart.currentTime = 0;
    if (speechRecVarsRef.current.clicked) {
      audioEnd.play();
      Recognition.stop();
      speechRecVarsRef.current.listening = false;
    }
    speechRecVarsRef.current.clicked = false;
  };
  const abort = () => Recognition.abort();
  Recognition.onstart = () => {
    if (speechErrMessage) {
      setTimeout(() => setSpeechErrMessage(``), 1000);
    }
  };
  Recognition.onaudiostart = () => {
    speechRecVarsRef.current.listening = true;
  };
  Recognition.onaudioend = () => {
    speechRecVarsRef.current.listening = false;
  };
  Recognition.onsoundstart = (ev) => {
    // setNomatch()
  };
  Recognition.onnomatch = () => {
    speechRecVarsRef.current.noMatch = true;
  };
  Recognition.onresult = (evt) => {
    let newArr = [];
    const speechRecResult = evt.results;
    [...speechRecResult].forEach((currentSpeechRes) => {
      speechRecVarsRef.current.transcript = currentSpeechRes[0].transcript;
      newArr.push(currentSpeechRes[0].transcript);
    });
    setTranscript((prev) => prev + ` ` + newArr.join());
  };
  Recognition.onend = () => {
    Recognition.start();
  };
  Recognition.onspeechend = () => {
    Recognition.stop();
  };
  Recognition.onerror = (evt) => {
    setSpeechErrMessage(evt.error);
  };
  useLayoutEffect(() => {
    if (
      !(`webkitSpeechRecognition` in window || `SpeechRecognition` in window)
    ) {
      setBrowserSupport(false);
    }
  }, [browserSupport]);
  return {
    browserSupport,
    transcript,
    setTranscript,
    speechErrMessage,
    startSpeechRec,
    stopSpeechRec,
    speechRecVarsRef,
    abort,
  };
}
