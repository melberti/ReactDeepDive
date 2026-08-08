import { createContext, useContext, useEffect, useReducer } from "react";

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

const SECS_PER_QUESTIONS = 30;

const initialState = {
  questions: [],
  status: "loading",
  questionIndex: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: 0,
};

const QuizContext = createContext();

function QuizProvider({ children }) {
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
    <QuizContext.Provider
      value={{
        questions,
        status,
        questionIndex,
        answer,
        points,
        highScore,
        secondsRemaining,
        possiblePoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext accessed outside of Provider");

  return context;
}

export { QuizProvider, useQuiz };
