import axios from 'axios';

export const axios_post = (url, payload) => {
    return axios({
        method: "POST",
        url: url,
        data: payload
    });
}

export const axios_post_header = (url, payload, token) => {
    return axios({
        headers: {
            Authorization: "Bearer " + token
        },
        method: "POST",
        url: url,
        data: payload
    });
}

export const axios_get_header = (url, token) => {
    return axios({
        headers: { Authorization: "Bearer " + token },
        method: "GET",
        url: url
    });
}

export const axios_patch_header = (url, payload, token) => {
    return axios({
        headers: { Authorization: "Bearer " + token },
        method: "PATCH",
        url: url,
        data: payload
    });
}

export const axios_put_header = (url, payload, token) => {
    return axios({
        headers: { Authorization: "Bearer " + token },
        method: "PUT",
        url: url,
        data: payload
    });
}

export const axios_post_header_file = (url, payload, token) => {
    return axios({
        headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'multipart/form-data'
        },
        method: "POST",
        url: url,
        data: payload,
    });
}

export const axios_delete_header = (url, payload, token) => {
    return axios({
        headers: { Authorization: "Bearer " + token },
        method: "DELETE",
        url: url,
        data: payload
    });
}