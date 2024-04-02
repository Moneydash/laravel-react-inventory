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

export const setErrorHelper = (fieldName, error, text, setError, setHelper) => {
    setError((prevError) => ({ ...prevError, [fieldName]: error }));
    setHelper((prevText) => ({ ...prevText, [fieldName]: text }));
}