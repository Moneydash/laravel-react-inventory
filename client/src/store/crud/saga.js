import { call, put, takeEvery } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from "./actions";
import { axios_delete_header, axios_get_header, axios_post_header, axios_put_header } from 'utils/requests';
import { decryptAccessToken } from 'utils/auth';
import { toast } from 'react-toastify';

const errMsg = "Oops, something went wrong. Please try again later.";
function* fetchItemsSaga(action) {
  const token = decryptAccessToken();
  try {
    const response = yield call(axios_get_header, action.url, token);
    if (response.status === 200) {
      if (response.statusText === "OK") {
        yield put(actions.fetchItemsSuccess(response.data, action.entity));
      }
    }
  } catch (error) {
    yield put(actions.fetchItemsFailure(error));
  }
}

function* createItemSaga(action) {
  const token = decryptAccessToken();
  try {
    const response = yield call(axios_post_header, action.url, action.payload, token);
    if (response.status === 200 || response.status === 201) {
      yield put(actions.createItemSuccess(response.data, action.entity));
      toast.success(response.data.message);
    }
  } catch (error) {
    yield put(actions.createItemFailure(error.message, action.entity));
    toast.error(errMsg)
  }
}

function* updateItemSaga(action) {
  const token = decryptAccessToken();
  try {
    const updatedItem = yield call(axios_put_header, `${action.url}${action.payload.id}`, action.payload, token);
    if (updatedItem.status === 200) {
      yield put(actions.updateItemSuccess(updatedItem.data, action.entity));
      toast.success(updatedItem.data.message);
    }
  } catch (error) {
    yield put(actions.updateItemFailure(error.message, action.entity));
    toast.error(errMsg);
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