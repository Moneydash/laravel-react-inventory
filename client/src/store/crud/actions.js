import * as actionTypes from './actionTypes';

// Create Item
export const createItemRequest = (item) => ({
  type: actionTypes.CREATE_ITEM_REQUEST,
  payload: item,
});

export const createItemSuccess = (item) => ({
  type: actionTypes.CREATE_ITEM_SUCCESS,
  payload: item,
});

export const createItemFailure = (error) => ({
  type: actionTypes.CREATE_ITEM_FAILURE,
  payload: error,
});

// Fetch Items
export const fetchItemsRequest = (url, entity) => ({
  type: actionTypes.FETCH_ITEMS_REQUEST,
  url,
  entity
});

export const fetchItemsSuccess = (items, entity) => ({
  type: actionTypes.FETCH_ITEMS_SUCCESS,
  payload: items,
  entity
});

export const fetchItemsFailure = (error, entity) => ({
  type: actionTypes.FETCH_ITEMS_FAILURE,
  payload: error,
  entity
});

// Update Item
export const updateItemRequest = (item) => ({
  type: actionTypes.UPDATE_ITEM_REQUEST,
  payload: item,
});

export const updateItemSuccess = (item) => ({
  type: actionTypes.UPDATE_ITEM_SUCCESS,
  payload: item,
});

export const updateItemFailure = (error) => ({
  type: actionTypes.UPDATE_ITEM_FAILURE,
  payload: error,
});

// Delete Item
export const deleteItemRequest = (itemId) => ({
  type: actionTypes.DELETE_ITEM_REQUEST,
  payload: itemId,
});

export const deleteItemSuccess = (itemId) => ({
  type: actionTypes.DELETE_ITEM_SUCCESS,
  payload: itemId,
});

export const deleteItemFailure = (error) => ({
  type: actionTypes.DELETE_ITEM_FAILURE,
  payload: error,
});

export const resetEntity = (entity) => ({
  type: actionTypes.RESET_ENTITY,
  entity
});