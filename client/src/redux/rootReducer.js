import { combineReducers } from "redux";
import toggleDrawer from "./components/drawer/drawerReducer";

const rootReducer = combineReducers({
    toggleDrawer: toggleDrawer
});

export default rootReducer;