import styles from "./Button.module.css";

function Button({ children, handleClick, type }) {
  //type to be used to conditionally render a CSS class
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={handleClick}>
      {children}
    </button>
  );
}

export default Button;
