import { useState } from "react";

export default function App() {
  return (
    <div>
      <Steps />
      <Steps />
    </div>
  );
}

function Steps() {
  const [step, setStep] = useState(1);

  const [isOpen, setIsOpen] = useState(true);

  function handlePrevious() {
    //although this works, it's a best practice to
    //always use a callback function instead
    //if (step > 1) setStep(step - 1);
    if (step > 1) setStep((s) => s - 1);
  }

  function handleNext() {
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
          <p className="message">{messages[step - 1]}</p>
          <div className="buttons">
            <button
              style={{ backgroundColor: "#7950f2", color: "#FFF" }}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              style={{ backgroundColor: "#7950f2", color: "#FFF" }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const messages = [
  "Learn React ⚛️",
  "Apply for jobs 💼",
  "Invest your new income 🤑",
];
