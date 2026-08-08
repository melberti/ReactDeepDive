import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}

function Header() {
  //const style = { color: "red", fontSize: "48px" };
  const style = {};
  return (
    <header className="header">
      <h1 style={style}>Fast React Pizza Company</h1>
    </header>
  );
}

function Menu() {
  const pizzas = pizzaData;
  const numPizzas = pizzas.length;

  return (
    <main className="menu">
      <h2>Our Menu</h2>

      {/* conditional rendering 
      if pizzas is truthy render the list of pizzas*/}
      {numPizzas > 0 ? (
        <>
          <p>
            Authentic Italian cuisine. 6 creative dishes to choose from, all
            from our stone oven, all organic, all delicious.
          </p>
          <ul className="pizzas">
            {pizzas.map((pizza) => (
              <Pizza pizzaObj={pizza} key={pizza.name} />
            ))}

            {/* {pizzaData.map((pizza) => (
          <Pizza
            name={pizza.name}
            price={pizza.price}
            ingredients={pizza.ingredients}
            photoName={pizza.photoName}
          />
        ))} */}
          </ul>
        </>
      ) : (
        <p>We're still working on our menu. Check back later.</p>
      )}
      {/* <Pizza


        name="Pizza Spinaci"
        ingredients="Tomato, mozarella, spinach, and ricotta cheese"
        photoName="pizzas/spinaci.jpg"
        price={12}
      />

      <Pizza
        name="Pizza Funghi"
        ingredients="Tomato, mozarella, mushrooms, and onion"
        photoName="pizzas/funghi.jpg"
        price={12}
      /> */}
    </main>
  );
}

function Pizza({ pizzaObj }) {
  //instead of passing props, we can pass {pizzaObj}
  //this allows us to then reference pizzaObj.photoName, pizzaObj.name, pizzaObj.ingredients etc
  //without pizzaObj
  //clarity over just props, which does not tell us what kind of data is being passed

  //we could use if logic to determine whether to return the pizza at all if marked sold out
  //then component doesn't render
  //if (props.pizzaObj.soldOut) return null;

  return (
    <li className={`pizza ${pizzaObj.soldOut && "sold-out"}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <span>{pizzaObj.soldOut ? "SOLD OUT" : pizzaObj.price + 4}</span>
      </div>
    </li>
  );
}

function Footer() {
  const hour = new Date().getHours();
  const openHour = 9;
  const closedHour = 22;
  const isOpen = hour >= openHour && openHour <= closedHour;

  console.log(isOpen);
  // if (hour >= openHour && openHour <= closedHour) alert("We're currently open");
  // else alert("Sorry, we're closed");

  //if/else and other JS logic can happen here, just not inside the return statement

  // short circuting; because first part is true, second is returned
  return (
    <footer className="footer">
      {isOpen ? (
        <Order closedHour={closedHour} openHour={openHour} />
      ) : (
        // this will never be true now because we added IF statementa above
        <p>
          We're happy to welcome you between {openHour}:00 and {closedHour}:00.
        </p>
      )}
    </footer>
  );
}

function Order({ closedHour, openHour }) {
  //instead of (props) we can pass a single prop by its name in JS mode
  //or pass a list of props ({openHour, closedHour})
  //or pass an object ({pizzaObj}) if we need that
  return (
    <div className="order">
      <p>
        We're open from {openHour}:00 to {closedHour}:00. Come visit us or order
        online.
      </p>
      <button className="btn">Order</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];
