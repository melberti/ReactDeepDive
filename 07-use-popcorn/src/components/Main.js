export default function Main({ children }) {
  //rather than accept {movies} as prop
  //and include MovieBox component
  //we can accept {children} which itself consists of MovieBox
  return <main className="main">{children}</main>;
}
