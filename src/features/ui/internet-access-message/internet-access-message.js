import { useState, useEffect } from "react";

export const InternetAccessMessage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const online = () => setIsOnline(true);
  const offline = () => setIsOnline(false);
  useEffect(() => {
    window.addEventListener(`online`, online);
    window.addEventListener(`offline`, offline);
    return () => {
      window.removeEventListener(`online`, online);
      window.removeEventListener(`offline`, offline);
    };
  }, []);
  return (
    <>
      {!isOnline && (
        <h2 style={{ textAlign: `center` }}>
          <b>App requires internet access</b>
        </h2>
      )}
    </>
  );
};
