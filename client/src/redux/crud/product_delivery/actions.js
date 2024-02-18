import { axios_get_header } from '../../../request/apiRequests';
import * as types from './types';

export const request_update = () => dispatch => {
    dispatch({
        type: types.REQUEST_UPDATE
    });
}
export const updateForm = (module, fieldName, fieldValue) => dispatch => {
    try {
        dispatch({
            type: types.UPDATE_FORM,
            payload: { module, fieldName, fieldValue }
        });
    } catch (error) {
        console.error("Error updating form: ", error);
    }
};
export const fetchData = (module, api, token) => async dispatch => {
    try {
        dispatch({
            type: types.REQUEST_FETCH_START
        });

        const response = await axios_get_header(api, token);
        const data = response.data;

        dispatch({
            type: types.REQUEST_FETCH_SUCCESS,
            payload: { module, data }
        });
    } catch (error) {
        dispatch({
            type: types.REQUEST_FETCH_ERROR,
            payload: { module, error }
        });
        console.error("Error fetching data:", error);
    }
};
export const resetForm = () => dispatch => {
    dispatch({
        type: types.REQUEST_RESET
    });
}