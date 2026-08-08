import { useQuiz } from "../contexts/QuizContext";
import Options from "./Options";

function Question() {
  const { questions, questionIndex, answer, dispatch } = useQuiz();

  if (!questions) return null;
  const question = questions[questionIndex];

  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
      />
    </div>
  );
}

export default Question;
