import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState, //because it has the same name as our var no need to write it twice
  reducers: {
    deposit(state, action) {
      state.balance = state.balance + action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },

    // //because this one has multiple parameters
    // //we would have to write it as an object
    // requestLoan: {
    //   //first prepare the data
    //   //note the payload names match the inputs
    //   //but need not match the names as send into the dispatch call (loanAmount, loanPurpose)
    //   prepare(amount, purpose) {
    //     return {
    //       payload: {
    //         amount,
    //         purpose,
    //       },
    //     };
    //   },
    //   //then we can use the data in the reducer function, now called reducer
    //   reducer(state, action) {
    //     if (state.loan > 0) return;

    //     state.loan = action.payload.amount;
    //     state.loanPurpose = action.payload.purpose;
    //     state.balance = state.balance + action.payload.amount;
    //   },
    // },

    //OR, an alternative is to send the parameters into the dispatch function
    //not as two parameters but as a single object that has two properties
    //see accountOperations
    //classic: dispatch(requestLoan(loanAmount,loanPurpose));
    //toolkit: dispatch(requestLoan({ amount: loanAmount, purpose: loanPurpose }));
    requestLoan(state, action) {
      console.log(action);
      state.loanPurpose = action.payload.purpose;
      state.loan = action.payload.amount;
      state.balance = state.balance + action.payload.amount;
    },

    payLoan(state, action) {
      if (state.loan === 0) return;
      state.loanPurpose = "";
      state.balance = state.balance - state.loan;
      state.loan = 0;
    },
    convertingCurrency(state, action) {
      state.isLoading = true;
    },
  },
});

//console.log(accountSlice);

//now export both the slice reducer and actions
export default accountSlice.reducer;

//because our currency conversion method with Toolkit would be complicated,
//keep existing deposit action creator and remove deposit from the export statement
//export const { deposit, withdraw, requestLoan, payLoan } = accountSlice.actions;
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

//classic deposit with thunk
export function deposit(amount, currency) {
  console.log(currency);

  if (currency === "USD") return { type: "account/deposit", payload: amount };
  //otherwise need to convert to USD
  //api call via thunk
  return async function (dispatch, getState) {
    //we don't need to dispatch again to turn off the loading state
    //because we can set it right in the dispatch method for setting deposit amount
    dispatch({ type: "account/convertingCurrency" });
    const resp = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=USD`,
    );

    //error checking should go here
    const data = await resp.json();

    const convertedAmount = (amount * data.rates.USD).toFixed(2);
    console.log(convertedAmount + " USD");

    dispatch({ type: "account/deposit", payload: convertedAmount });
  };
}

//classic
// export default function accountReducer(state = initialState, action) {
//   switch (action.type) {
//     case "account/deposit":
//       return {
//         ...state,
//         balance: state.balance + Number(action.payload),
//         isLoading: false,
//       };
//     case "account/withdraw":
//       return { ...state, balance: state.balance - Number(action.payload) };
//     case "account/requestLoan":
//       if (state.loan > 0) return state;
//       //payload needs updated to payload.purpose or something like that
//       return {
//         ...state,
//         loanPurpose: action.payload.purpose,
//         loan: action.payload.amount,
//         balance: state.balance + action.payload.amount,
//       };
//     case "account/payLoan":
//       if (state.loan === 0) return state;

//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: "",
//         balance: state.balance - state.loan,
//       };
//     case "account/convertingCurrency":
//       return { ...state, isLoading: true };
//     default:
//       return state;
//   }
// }

// export function withdraw(amount) {
//   return { type: "account/withdraw", payload: amount };
// }

// export function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: { amount: amount, purpose: purpose },
//   };
// }

// export function payLoan() {
//   return { type: "account/payLoan" };
// }
