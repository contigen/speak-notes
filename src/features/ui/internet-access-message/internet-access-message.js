import { useState, useEffect } from "react";

export const InternetAccessMessage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    window.addEventListener(`online`, () => {
      setIsOnline(true);
    });
    window.addEventListener(`offline`, () => {
      setIsOnline(false);
    });
    return () => {
      window.removeEventListener();
      window.removeEventListener();
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
