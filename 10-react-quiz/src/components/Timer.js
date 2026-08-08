import { useEffect } from "react";
import { useQuiz } from "../contexts/QuizContext";

function Timer() {
  const { secondsRemaining, dispatch } = useQuiz();

  const minutes = Math.floor(secondsRemaining / 60); // Get full minutes
  const seconds = secondsRemaining % 60; // Get remaining seconds

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "countdown" });
        //console.log(new Date());
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch],
  );

  return (
    <div className="timer">
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}

export default Timer;
