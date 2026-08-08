import { useQuiz } from "../contexts/QuizContext";

function Progress() {
  const { questionIndex, numQuestions, points, possiblePoints, answer } =
    useQuiz();
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={questionIndex + Number(answer !== null)}
      />
      <p>
        Question <strong>{questionIndex + 1}</strong> / {numQuestions}
      </p>
      <p>
        Points <strong>{points}</strong> / {possiblePoints}
      </p>
    </header>
  );
}

export default Progress;
