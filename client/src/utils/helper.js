import { decryptAccessToken } from "./auth";
import { axios_get_header } from "./requests";

export const fetcher = async (url) => {
    const decrypt_access_token = decryptAccessToken();
    try {
        const response = await axios_get_header(url, decrypt_access_token);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const nullCheck = (string) => {
    if (string === null || string === undefined || string === '' || string === 'null') {
        return true;
    } else {
        return false;
    }
}

export const militaryTimeToCommon = (time) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':');

    // Create a new Date object and set the hours and minutes
    const date = new Date();
    date.setHours(hours, minutes);

    // Convert to 12-hour format and return
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export const isoDateToCommon = (dateData) => {
    const date = new Date(dateData);
    // Extract the date components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = date.getDate().toString().padStart(2, '0');

    // Create the formatted date string in "yyyy-mm-dd HH:mm:ss" format
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
};

export const fileNameSplit = (string) => {
    if (string !== '' && typeof string === 'string') {
        const fileName = string.split("/").pop();
        return fileName;
    } else {
        return '';
    }
};

export const pathCleaner = (string) => {
    const cleanedPath = string.substring(string.indexOf('/') + 1);
    return cleanedPath;
}

export const setData = (setter, fieldName, value) => {
    setter((prevState) => ({ ...prevState, [fieldName]: value }));
}

export const setErrorHelper = (fieldName, error, text, setError, setHelper) => {
    setError((prevError) => ({ ...prevError, [fieldName]: error }));
    setHelper((prevText) => ({ ...prevText, [fieldName]: text }));
}

export const firstCap = (string) => {
    const text = string.charAt(0).toUpperCase() + string.slice(1);
    return text;
}

export const apiGetHelper = async (url, setter, arrayField) => {
    const decrypt_access_token = decryptAccessToken();
    try {
        const response = await axios_get_header(url, decrypt_access_token);
        const data = response.data;

        setter(data[arrayField]);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const phNumRegex = (string) => {
    const ph_mobile_regex = /^(09|\+639)\d{9}$/;
    const isValidPhNum = ph_mobile_regex.test(string) ? true : false;
    return isValidPhNum;
}

export const wholeNumRegex = (string) => {
    const number = /^[1-9]\d*$/;
    return number.test(string);
}

export const decimalNumRegex = (string) => {
    const number = /^[1-9]\d*(\.\d+)?$/
    return number.test(string);
}