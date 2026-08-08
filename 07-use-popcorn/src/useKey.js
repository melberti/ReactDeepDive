import { useEffect } from "react";

export function useKey(key, callbackAction) {
  //add "escape" event listener
  //requires cleanup, or we will have multiple listeners
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          //console.log("closing movie");
          callbackAction?.();
          //onCloseMovie();
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [callbackAction, key],
  );
}
