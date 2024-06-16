import { all, fork } from "redux-saga/effects";
import itemSaga from "./crud/saga";

export default function* rootSaga() {
    yield all([
        fork(itemSaga)
    ]);
};