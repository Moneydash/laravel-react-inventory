import { configureStore } from "@reduxjs/toolkit";
import { reducer as productDeliveryReducer } from "./crud/product_delivery"; // Import your rootReducer

const store = configureStore({
  reducer: productDeliveryReducer,
});

export default store;