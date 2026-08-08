import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      //because we can mutate state when we use Toolkit
      //we can directly add an item to the array
      //payload = newItem
      //check that item does not already exist
      const pizza = state.cart.find(
        (item) => item.pizzaId === action.payload.pizzaId,
      );

      if (pizza) {
        //console.log("update pizza qty");
        pizza.quantity++;
        pizza.totalPrice = pizza.quantity * pizza.unitPrice;
      } else {
        //console.log("add pizza to cart");
        state.cart.push(action.payload);
      }
      //console.log(`state after work: ${JSON.stringify(state.cart)}`);
    },
    deleteItem(state, action) {
      //payload = pizzaId
      //console.log(`delete item triggered for ${action.payload}`);
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
    },

    increaseItemQuantity(state, action) {
      //payload = pizzaId
      //console.log("increaseItemQuantity triggered");
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity += 1; //could use ++
      item.totalPrice = item.quantity * item.unitPrice;
    },
    decreaseItemQuantity(state, action) {
      //console.log("decreaseItemQuantity triggered");
      const item = state.cart.find((item) => item.pizzaId === action.payload);
      item.quantity--; //could use -= 1
      item.totalPrice = item.quantity * item.unitPrice;

      //console.log(`cart before deleteitem ${JSON.stringify(state.cart)}`);
      if (item.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
      //console.log(`cart after  deleteitem ${JSON.stringify(state.cart)}`);
    },
    clearCart(state) {
      state.cart = [];
      //console.log(`clearCart triggered; current state.cart: ${state.cart}`);
    },
  },
});

export default cartSlice.reducer;

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export const getCartTotalPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCartTotalQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getCart = (state) => state.cart.cart;

export const getQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
