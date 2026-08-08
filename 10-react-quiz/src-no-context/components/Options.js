function Options({ question, answer, dispatch }) {
  const hasAnswer = answer !== null;
  return (
    <>
      <div className="options">
        {question.options.map((option, idx) => {
          //console.log(`idx: ${idx} correctAnswer: ${question.correctOption}`);

          return (
            <button
              className={`btn btn-option ${idx === answer ? "answer" : ""} 
            ${
              hasAnswer
                ? idx === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
              key={option}
              onClick={() => dispatch({ type: "answerQuestion", payload: idx })}
              disabled={hasAnswer}
            >
              {option}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default Options;
