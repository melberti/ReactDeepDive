import { createSlice } from "@reduxjs/toolkit";

const initialState = { fullName: "", nationalId: "", createdAt: "" };

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    createCustomer(state, action) {
      state.fullName = action.payload.fullName;
      state.nationalid = action.payload.nationalId;
      state.createdAt = action.payload.createdAt;
    },
    updateName(state, action) {
      state.fullName = action.payload;
    },
  },
});

export default customerSlice.reducer;

export const { createCustomer, updateName } = customerSlice.actions;

// export default function customerReducer(state = initialState, action) {
//   switch (action.type) {
//     case "customer/createCustomer":
//       return {
//         ...state,
//         fullName: action.payload.fullName,
//         nationalId: action.payload.nationalId,
//         createdAt: action.payload.createdAt,
//       };
//     case "customer/updateName":
//       return { ...state, fullName: action.payload };
//     default:
//       return state;
//   }
// }

// export function createCustomer(fullName, nationalId) {
//   //we need to create the date here
//   //if we created in the reducer that would cause a side effect
//   //which must be avoided
//   return {
//     type: "customer/createCustomer",
//     payload: { fullName, nationalId, createdAt: new Date().toISOString() },
//   };
// }

// export function updateName(fullName, nationalId) {
//   return { type: "customer/updateName", payload: fullName };
// }
