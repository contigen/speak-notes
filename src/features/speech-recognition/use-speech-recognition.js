import { useLayoutEffect, useState, useRef } from "react";
import firstAudioUrl from "../../sounds/audio-start.mp3";
import secondAudioUrl from "../../sounds/audio-end.mp3";

export function useSpeechRecognition() {
  const [browserSupport, setBrowserSupport] = useState(true);
  const [transcript, setTranscript] = useState({
    preview: ``,
    note: ``,
  });
  const [speechErrMessage, setSpeechErrMessage] = useState(``);

  const Recognition =
    new window.webkitSpeechRecognition() || new window.SpeechRecognition();
  Recognition.interimResults = true;
  const speechRecVarsRef = useRef({
    clicked: false,
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
      speechRecVarsRef.current.listening = true;
    }
    speechRecVarsRef.current.clicked = true;
  };
  const stopSpeechRec = () => {
    if (speechRecVarsRef.current.clicked) {
      audioStart.pause();
      audioStart.currentTime = 0;
      audioEnd.play();
      Recognition.stop();
      speechRecVarsRef.current.listening = false;
    }
    speechRecVarsRef.current.clicked = false;
  };
  const abort = () => {
    stopSpeechRec();
    Recognition.abort();
  };
  Recognition.onstart = () => {};
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
    const speechRecResult = evt.results;
    [...speechRecResult].forEach((currentSpeechRes) => {
      setTranscript((prev) => {
        return { ...prev, preview: currentSpeechRes[0].transcript };
      });
      // if recognised speech appears to be a completed one, then add it to the note.
      if (currentSpeechRes.isFinal) {
        setTranscript((prev) => {
          return {
            ...prev,
            note: prev.note + ` ` + currentSpeechRes[0].transcript,
          };
        });
      }
    });
  };
  Recognition.onend = () => {
    Recognition.start();
    speechRecVarsRef.current.clicked = true;
    // speechRecVarsRef.current.noMatch = false;
    speechRecVarsRef.current.listening = true;
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
    Recognition,
    browserSupport,
    transcript,
    setTranscript,
    speechErrMessage,
    startSpeechRec,
    speechRecVarsRef,
    abort,
  };
}
