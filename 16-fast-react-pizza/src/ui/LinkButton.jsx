import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

const twClasses = "text-sm text-blue-500 hover:text-blue-700 hover:underline";

function LinkButton({ to, children }) {
  const navigate = useNavigate();

  if (to === "-1") {
    return (
      <button onClick={() => navigate(-1)} className={twClasses}>
        {children}
      </button>
    );
  }
  return (
    <Link to={to} className={twClasses}>
      {children}
    </Link>
  );
}

export default LinkButton;
