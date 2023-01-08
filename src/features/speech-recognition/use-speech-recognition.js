import { useLayoutEffect, useState, useRef } from "react";
import firstAudioUrl from "../../sounds/audio-start.mp3";
import secondAudioUrl from "../../sounds/audio-end.mp3";

const audioStart = new Audio(firstAudioUrl);
const audioEnd = new Audio(secondAudioUrl);

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
    stopped: false,
  });
  const startSpeechRec = () => {
    // calling Recognition.start() more than once throws an error
    if (!speechRecVarsRef.current.clicked) {
      Recognition.start();
      audioStart.play();
      speechRecVarsRef.current.listening = true;
      speechRecVarsRef.current.clicked = true;
      speechRecVarsRef.current.stopped = false;
    }
  };
  const stopSpeechRec = () => {
    if (speechRecVarsRef.current.clicked) {
      audioStart.pause();
      audioStart.currentTime = 0;
      audioEnd.play();
      Recognition.stop();
      speechRecVarsRef.current.listening = false;
      speechRecVarsRef.current.clicked = false;
      speechRecVarsRef.current.stopped = true;
    }
  };
  Recognition.onaudiostart = () => {
    speechRecVarsRef.current.listening = true;
  };
  Recognition.onaudioend = () => {
    speechRecVarsRef.current.listening = false;
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
      // if recognised speech sounds like a complete sentence, then add it to the note.
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
    if (speechRecVarsRef.current.stopped) return;
    // to make the Web Speech API listen continuously
    Recognition.start();
    speechRecVarsRef.current.clicked = true;
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
    browserSupport,
    transcript,
    setTranscript,
    speechErrMessage,
    startSpeechRec,
    speechRecVarsRef,
    stopSpeechRec,
  };
}
