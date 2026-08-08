import { Link } from "react-router-dom";

//base: common to all buttons
//no text size or padding attributes
const baseStyle =
  "rounded-full bg-yellow-300 font-semibold uppercase tracking-wide text-stone-700 transition-colors duration-200 hover:bg-yellow-400 focus:bg-yellow-400 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 active:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500";

const styles = {
  primary: baseStyle + " text-sm px-2 py-3 md:px-5",
  secondary:
    "text-sm rounded-full border-2 border-stone-400 font-semibold uppercase tracking-wide text-stone-500 transition-colors duration-200 hover:bg-stone-200 focus:bg-stone-400 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 active:bg-stone-300 disabled:cursor-not-allowed px-2 py-2 md:px-4",
  small: baseStyle + " px-1 py-2 md: px-3 text-xs",
};

function Button({ disabled, onClick, to, type, children }) {
  if (to) {
    //console.log(`return link ${to}`);
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button className={styles[type]} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <button className={styles[type]} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
