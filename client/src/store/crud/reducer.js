import { isEqual } from 'lodash';
import * as actionTypes from './actionTypes';

const initialState = {
  items: {
    leads: [],
    users: []
  },
  loading: false,
  error: null,
  currentPage: 1,
  perPage: 10,
  search: '',
  totalPages: 1
};

const crudReducer = (state = initialState, action) => {
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
      };

    case actionTypes.FETCH_ITEMS_SUCCESS:
      return {
          ...state,
          loading: false,
          items: {
            ...state.items,
            [action.entity]: 
              !isEqual(state.items[action.entity], action.payload.data) ? action.payload.data : state.items[action.entity] // Only update if data has changed
          },
          totalPages: action.payload.last_page,
          currentPage: action.payload.current_page,
          perPage: action.payload.per_page,
          search: action.payload.search
      };
    case actionTypes.UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false
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

export default crudReducer;