import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { reducer as productDeliveryReducer } from "./crud/product_delivery"; // Import your rootReducer
import { thunk } from 'redux-thunk'; // Import Redux Thunk middleware

const store = configureStore({
  reducer: productDeliveryReducer,
  middleware: [thunk, ...getDefaultMiddleware()]
});

export default store;