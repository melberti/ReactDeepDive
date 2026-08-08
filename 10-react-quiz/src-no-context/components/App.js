import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Timer from "./Timer";
import Footer from "./Footer";

const SECS_PER_QUESTIONS = 30;

function App() {
  const initialState = {
    questions: [],
    status: "loading",
    questionIndex: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: 0,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    questionIndex,
    answer,
    points,
    highScore,
    secondsRemaining,
  } = state; //destructure

  const possiblePoints =
    questions.length > 0
      ? questions.reduce((accum, q) => accum + q.points, 0)
      : 0;

  function reducer(state, action) {
    //console.log(action.type);
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };
      case "dataFailed":
        //loading, error, ready, active, finished
        return { ...state, status: "error" };
      case "quizStarted":
        return {
          ...state,
          status: "active",
          secondsRemaining: state.questions.length * SECS_PER_QUESTIONS,
        };
      case "answerQuestion":
        //get current question
        //must scope state values with state.
        //remember you can't yet access answer from state
        //because it hasn't been saved;
        //have to use action.payload for comparison
        const curQuestion = state.questions[state.questionIndex];

        return {
          ...state,
          answer: action.payload,
          points:
            state.points +
            (action.payload === curQuestion.correctOption
              ? curQuestion.points
              : 0),
        };
      case "next":
        return {
          ...state,
          answer: null,
          questionIndex: state.questionIndex + 1,
        };

      case "finish":
        //update high score if you beat it
        console.log(
          `highScore: ${state.highScore} current score: ${state.points}`,
        );
        return {
          ...state,
          status: "finished",
          highScore:
            state.highScore === 0 || state.points > state.highScore
              ? state.points
              : state.highScore,
        };

      case "restart":
        return {
          ...initialState,
          questions: state.questions,
          status: "ready",
          highScore: state.highScore,
          secondsRemaining: state.questions.length * SECS_PER_QUESTIONS,
        };

      case "countdown":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? "finished" : state.status,
        };

      default:
        throw new Error("Unrecognized action requested");
    }
  }

  useEffect(function () {
    async function getQuestions() {
      //console.log(state);
      const resp = await fetch("http://localhost:8000/questions");

      if (!resp.ok) {
        console.log("error retrieving data");
        dispatch({ type: "dataFailed" });
        return;
      }
      const data = await resp.json();
      //console.log(data);

      dispatch({ type: "dataReceived", payload: data });
    }
    getQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={questions.length} dispatch={dispatch} />
        )}

        {status === "active" && (
          <>
            <Progress
              questionIndex={questionIndex}
              numQuestions={questions.length}
              points={points}
              possiblePoints={possiblePoints}
              answer={answer}
            />
            <Question
              question={questions[questionIndex]}
              questionIndex={questionIndex}
              questionCount={questions.length}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                secondsRemaining={secondsRemaining}
                dispatch={dispatch}
              ></Timer>
              <NextButton
                answer={answer}
                dispatch={dispatch}
                index={questionIndex}
                numQuestions={questions.length}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishedScreen
            points={points}
            possiblePoints={possiblePoints}
            dispatch={dispatch}
            highScore={highScore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
