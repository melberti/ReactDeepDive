import { useEffect, useRef } from "react";

export default function useOutsideClick(handler, listenOnCapture = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current) {
          if (!ref.current.contains(e.target)) {
            handler();
          }
        }
      }

      document.addEventListener("click", handleClick, listenOnCapture);

      //remove listener as component un-mounts
      //by returning callback function
      return () =>
        document.removeEventListener("click", handleClick, listenOnCapture);
    },
    [handler, listenOnCapture],
  );
  return ref;
}
