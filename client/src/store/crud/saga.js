import { call, put, takeEvery } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from "./actions";
import Cookies from 'js-cookie';
import { get, post, put as apiPut } from 'utils/fetch';
import { axios_delete_header, axios_get_header, axios_post_header } from 'utils/requests';
import { decryptAccessToken } from 'utils/auth';

function* fetchItemsSaga(action) {
  const token = decryptAccessToken();
  try {
    const response = yield call(axios_get_header, action.url, token);
    if (response.status === 200) {
      if (response.statusText === "OK") {
        yield put(actions.fetchItemsSuccess(response.data[action.entity], action.entity));
      }
    }
  } catch (error) {
    yield put(actions.fetchItemsFailure(error));
  }
}

function* createItemSaga(action) {
  try {
    const response = yield call(axios_post_header, action.payload.url, action.payload);
    if (response.status === 200 || response.status === 201) {
      yield put(actions.createItemSuccess(response));
    }
  } catch (error) {
    yield put(actions.createItemFailure(error));
  }
}

function* updateItemSaga(action) {
  try {
    const updatedItem = yield call(apiPut, `${action.payload.url}/${action.payload.id}`, action.payload);
    yield put(actions.updateItemSuccess(updatedItem));
  } catch (error) {
    yield put(actions.updateItemFailure(error));
  }
}

function* deleteItemSaga(action) {
  try {
    yield call(axios_delete_header, `${action.payload.url}${action.payload}`);
    yield put(actions.deleteItemSuccess(action.payload));
  } catch (error) {
    yield put(actions.deleteItemFailure(error));
  }
}

export default function* itemSaga() {
  yield takeEvery(actionTypes.FETCH_ITEMS_REQUEST, fetchItemsSaga);
  yield takeEvery(actionTypes.CREATE_ITEM_REQUEST, createItemSaga);
  yield takeEvery(actionTypes.UPDATE_ITEM_REQUEST, updateItemSaga);
  yield takeEvery(actionTypes.DELETE_ITEM_REQUEST, deleteItemSaga);
}