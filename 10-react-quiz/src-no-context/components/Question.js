import Options from "./Options";

function Question({
  question,
  questionIndex,
  questionCount,
  answer,
  dispatch,
}) {
  //console.log(question);

  if (question === null) return null;

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;
