function FinishedScreen({ points, possiblePoints, highScore, dispatch }) {
  return (
    <div>
      <p className="result">
        You scored {points} out of {possiblePoints} (
        {Math.floor((points / possiblePoints) * 100)}
        {"%"})
        <br />
        Your high score is {highScore}.
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Start Over
      </button>
    </div>
  );
}

export default FinishedScreen;
