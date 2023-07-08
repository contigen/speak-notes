import "./textarea.css";
import { useLayoutEffect, forwardRef } from "react";

const MIN_TEXTAREA_HEIGHT = 30;

export const TextArea = forwardRef((props, textareaRef) => {
  useLayoutEffect(() => {
    // Reset height - avoid textarea shrink
    textareaRef.current.style.height = `inherit`;
    textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [props.value, textareaRef]);
  return (
    <textarea
      {...props}
      style={{
        minHeight: MIN_TEXTAREA_HEIGHT,
      }}
      ref={textareaRef}
    ></textarea>
  );
});
