import { useLayoutEffect, useState, useRef } from "react";

export function useSpeechRecognition() {
  const [browserSupport, setBrowserSupport] = useState(true);
  const [transcript, setTranscript] = useState(``);
  const [speechErrMessage, setSpeechErrMessage] = useState(``);
  const [noMatch, setNoMatch] = useState(false);
  const [listening, setListening] = useState(false);

  const Recognition =
    new window.webkitSpeechRecognition() || new window.SpeechRecognition();
  const clickedRef = useRef(false);
  // let { current: transcriptRef } = useRef(``);
  let transcriptRef = useRef(``);
  const startSpeechRec = () => {
    // audioStart.play();
    // calling Recognition.start() more than once throws an error
    if (!clickedRef.current) {
      Recognition.start();
    }
    clickedRef.current = true;
  };
  const stopSpeechRec = () => {
    Recognition.stop();
    clickedRef.current = false;
    setListening(false);
  };
  Recognition.onstart = () => setSpeechErrMessage(``);

  Recognition.onaudiostart = (ev) => {
    setListening(true);
  };
  Recognition.onaudioend = () => {
    setListening(false);
  };
  Recognition.onsoundstart = (ev) => {
    // setNomatch()
  };
  Recognition.onnomatch = () => {
    setNoMatch(true);
  };
  Recognition.onresult = (evt) => {
    let newArr = [];
    const speechRecResult = evt.results;
    [...speechRecResult].forEach((currentSpeechRes) => {
      newArr.push(currentSpeechRes[0].transcript);
      transcriptRef.current = currentSpeechRes[0].transcript;
    });
    setTranscript((prev) => prev + ` ` + newArr.join());
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
  }, [browserSupport]);
  return {
    browserSupport,
    transcript,
    setTranscript,
    speechErrMessage,
    startSpeechRec,
    stopSpeechRec,
    noMatch,
    listening,
    transcriptRef,
    clickedRef,
  };
}
