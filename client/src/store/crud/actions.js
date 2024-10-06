import * as actionTypes from './actionTypes';

// Create Item
export const createItemRequest = (item, url, entity) => ({
  type: actionTypes.CREATE_ITEM_REQUEST,
  payload: item,
  url,
  entity
});

export const createItemSuccess = (item, entity) => ({
  type: actionTypes.CREATE_ITEM_SUCCESS,
  payload: item,
  entity
});

export const createItemFailure = (error, entity) => ({
  type: actionTypes.CREATE_ITEM_FAILURE,
  payload: error,
  entity
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
export const updateItemRequest = (item, url, entity) => ({
  type: actionTypes.UPDATE_ITEM_REQUEST,
  payload: item,
  url,
  entity
});

export const updateItemSuccess = (item, entity) => ({
  type: actionTypes.UPDATE_ITEM_SUCCESS,
  payload: item,
  entity
});

export const updateItemFailure = (error, entity) => ({
  type: actionTypes.UPDATE_ITEM_FAILURE,
  payload: error,
  entity
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