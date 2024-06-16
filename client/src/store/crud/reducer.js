import * as actionTypes from './actionTypes';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_ITEM_REQUEST:
    case actionTypes.FETCH_ITEMS_REQUEST:
    case actionTypes.UPDATE_ITEM_REQUEST:
    case actionTypes.DELETE_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.CREATE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
      };

    case actionTypes.FETCH_ITEMS_SUCCESS:
      console.log('actions', action);
      console.log('payload item reducer', action.payload);
      return {
        ...state,
        loading: false,
        items: {
          ...state.items,
          [action.entity]: action.payload
        },
      };

    case actionTypes.UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case actionTypes.DELETE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case actionTypes.CREATE_ITEM_FAILURE:
    case actionTypes.FETCH_ITEMS_FAILURE:
    case actionTypes.UPDATE_ITEM_FAILURE:
    case actionTypes.DELETE_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    case actionTypes.RESET_ENTITY:
      return {
        ...state.items,
        [action.entity]: []
      }

    default:
      return state;
  }
};

export default itemReducer;