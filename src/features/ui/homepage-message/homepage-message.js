export const HomepageMessage = ({ browserSupport }) => {
  return browserSupport ? (
    <>
      <h1>Speak-notes: A Speech Recognition App</h1>
      <p>
        The App accesses your microphone, if you permit apparently. <b>*</b>No
        user data stored.
      </p>
      <h3>Speak • Transcribe - edit transcript • Download transcript.</h3>
    </>
  ) : (
    <>
      <h1> Speak-notes: A Speech Recognition App</h1>
      <p>
        Your browser lacks support for the Web Speech Recognition service,
        sorry. <small style={{ color: `#ccc` }}>in your face! ;‑)</small>
      </p>
    </>
  );
};
