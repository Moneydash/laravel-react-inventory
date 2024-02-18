import axios from 'axios';

export const axios_post = (url, payload) => {
    return axios({
        method: "POST",
        url: process.env.REACT_APP_API_BASE_URL + url,
        data: payload
    });
}

export const axios_post_header = (url, payload, token) => {
    return axios({
        headers: {
            Authorization: "Bearer " + token
        },
        method: "POST",
        url: process.env.REACT_APP_API_BASE_URL + url,
        data: payload
    });
}

export const axios_get_header = (url, token) => {
    return axios({
        headers: { Authorization: "Bearer " + token },
        method: "GET",
        url: process.env.REACT_APP_API_BASE_URL + url
    });
}

export const axios_patch_header = (url, payload, token) => {
    return axios({
        headers: { Authorization: "Bearer " + token },
        method: "PATCH",
        url: process.env.REACT_APP_API_BASE_URL + url,
        data: payload
    });
}

export const axios_put_header = (url, payload, token) => {
    return axios({
        headers: { Authorization: "Bearer " + token },
        method: "PUT",
        url: process.env.REACT_APP_API_BASE_URL + url,
        data: payload
    });
}

export const axios_post_header_img = (url, payload, token) => {
    return axios({
        headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'multipart/form-data'
        },
        method: "POST",
        url: process.env.REACT_APP_API_BASE_URL + url,
        data: payload,
    });
}