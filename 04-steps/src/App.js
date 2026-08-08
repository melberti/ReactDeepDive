import { useState } from "react";

export default function App() {
  return (
    <div>
      <Steps />
    </div>
  );
}

function Steps() {
  const [step, setStep] = useState(1);

  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    console.log("handleNext");
    //although this works, it's a best practice to
    //always use a callback function instead
    //if (step > 1) setStep(step - 1);
    if (step > 1) setStep((s) => s - 1);
  }

  function handleNext() {
    console.log("handleNext");
    //although this works, it's a best practice to
    //always use a callback function instead
    //if (step < 3) setStep(step + 1);
    if (step < 3) setStep((s) => s + 1);
  }

  function handleClose() {
    //although this works, it's a best practice to
    //always use a callback function instead
    //setIsOpen(!isOpen);
    setIsOpen((o) => !o);
  }

  //react will remember the state of step buttons if window is closed and re-opened

  return (
    <div>
      {/* example of inline function for onClick
      <button className="close" onClick={() => setIsOpen(!isOpen)}>
        &times;
      </button> */}
      <button className="close" onClick={handleClose}>
        &times;
      </button>
      {isOpen && (
        <div className="steps">
          <div className="numbers">
            <div className={step >= 1 && "active"}>1</div>

            <div className={step >= 2 && "active"}>2</div>

            <div className={step >= 3 && "active"}>3</div>
          </div>

          <StepMessage step={step}>{messages[step - 1]}</StepMessage>

          <div className="buttons">
            <Button
              backgroundColor="pink"
              textColor="black"
              handlerMethod={handlePrevious}
            >
              <span>⏮️</span>Previous
            </Button>
            <Button
              backgroundColor="orange"
              textColor="#FFF"
              clickHandler={handleNext}
            >
              Next<span>⏭️</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepMessage({ step, children }) {
  return (
    <>
      <div className="message">
        <h3>Step {step}</h3>
        {children}
      </div>
    </>
  );
}

function Button({ backgroundColor, textColor, clickHandler, children }) {
  //rather than passing text, emoji and position for button text,
  //pass in JSX as children
  return (
    <button
      style={{
        backgroundColor: `${backgroundColor}`,
        color: `${textColor}`,
      }}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
}

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑",
];
