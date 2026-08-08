import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
  const { questions, answer, dispatch, questionIndex } = useQuiz();
  const numQuestions = questions.length;

  if (answer === null) return null;

  if (questionIndex < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "next" })}
      >
        Next
      </button>
    );
  }

  if (questionIndex === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
  }
}

export default NextButton;
