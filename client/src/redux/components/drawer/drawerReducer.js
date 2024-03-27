import { OPEN_DRAWER, CLOSE_DRAWER } from "./drawerActions";

const initialState = {
    drawer: true
};

function toggleDrawer(state = initialState, action) {
    switch(action.type) {
        case OPEN_DRAWER:
            return {
                ...state,
                drawer: true
            };
        case CLOSE_DRAWER:
            return {
                ...state,
                drawer: false
            };
        default:
            return state;
    }
}

export default toggleDrawer;