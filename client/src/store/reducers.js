import { combineReducers } from "redux";
import itemReducer from "./crud/reducer";
import toggleDrawer from "./components/drawer/reducer"; 

const rootReducer = combineReducers({
    toggleDrawer,
    itemReducer
});

export default rootReducer;