import { toast } from "react-toastify";
import { decryptAccessToken } from "./auth";
import { axios_get_header } from "./requests";
import { createSelector } from "reselect";

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
};

export const militaryTimeToCommon = (time) => {
    // Split the time string into hours and minutes
    const [hours, minutes] = time.split(':');

    // Create a new Date object and set the hours and minutes
    const date = new Date();
    date.setHours(hours, minutes);

    // Convert to 12-hour format and return
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

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

export const isoDateToCommonDateTime = (dateTimeData) => {
    const date = new Date(dateTimeData);
    // Extract the date components
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = date.getDate().toString().padStart(2, '0');

    // Extract and format the time components in AM/PM format (hours and minutes only)
    const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    // Create the formatted date string in "mm/dd/yyyy hh:mm AM/PM" format
    const formattedDate = `${month}/${day}/${year} ${formattedTime}`;
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
};

export const setData = (setter, fieldName, value) => {
    setter((prevState) => ({
        ...prevState,
        [fieldName]: value === null ? '' : value // Replace null with empty string
    }));
};

export const setErrorHelper = (fieldName, error, text, setError, setHelper) => {
    setError((prevError) => ({ ...prevError, [fieldName]: error }));
    setHelper((prevText) => ({ ...prevText, [fieldName]: text }));
};

export const setErrorOnly = (setError, fieldName, error) => {
    setError((prevError) => ({ ...prevError, [fieldName]: error }));
};

export const firstCap = (string) => {
    const text = string.charAt(0).toUpperCase() + string.slice(1);
    return text;
};

export const apiGetHelper = async (url, setter, arrayField) => {
    const decrypt_access_token = decryptAccessToken();
    try {
        const response = await axios_get_header(url, decrypt_access_token);
        const data = response.data;

        // Check if the specified field is an array
        if (Array.isArray(data[arrayField])) {
            setter(data[arrayField]); // Set the array directly
        } else if (typeof data[arrayField] === 'object' && data[arrayField] !== null) {
            // Ensure data[arrayField] is an object and not null
            const newState = {}; // Create a new state object
            for (const field in data[arrayField]) {
                if (data[arrayField].hasOwnProperty(field)) { // Check if the property belongs to the object
                    newState[field] = nullCheck(data[arrayField][field]) ? '' : data[arrayField][field];
                }
            }
            setter((prevState) => ({ ...prevState, ...newState })); // Update state with new values
        } else {
            console.error(`Unexpected data format for ${arrayField}:`, data[arrayField]);
            setter([]); // Handle unexpected format
        }
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error for further handling
    }
};

export const apiFormGetHelper = async(url, setter, setField, arrayField) => {
    const decrypt_access_token = decryptAccessToken();
    try {
        const response = await axios_get_header(url, decrypt_access_token);
        const data = response.data;

        setter((prevState) => ({ ...prevState, [setField]: data[arrayField] }));
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const phNumRegex = (string) => {
    const ph_mobile_regex = /^(09|\+639)\d{9}$/;
    const isValidPhNum = ph_mobile_regex.test(string) ? true : false;
    return isValidPhNum;
};

export const wholeNumRegex = (string) => {
    const number = /^[1-9]\d*$/;
    return number.test(string);
};

export const decimalNumRegex = (string) => {
    const number = /^[1-9]\d*(\.\d+)?$/
    return number.test(string);
};

export const twoDigitDecimal = (number) => {
    if (!isNaN(number)) {
        const num = parseFloat(number).toFixed(2);
        return Number(num).toLocaleString('en-US');
    } else {
        console.error('Not a decimal number');
    }
};

export const createFormData = (data) => {
    if (typeof data === 'object') {
        const createdFormData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            createdFormData.append(key, value);
        });
        return createdFormData;
    } else {
        console.error('Data is not an object');
        return null;
    }
}

export const crumbsHelper = ( submodule, module, module_link ) => {
    if (nullCheck(submodule)) {
        return [
            { text: 'Dashboard', link: '../dashboard' },
            { text: module }
        ];
    } else {
        return [
            { text: 'Dashboard', link: '../dashboard' },
            { text: module, link: module_link },
            { text: submodule }
        ];
    }
};

export const validateTin = (tin) => {
    // Remove any hyphens from the TIN
    const cleanedTIN = tin.replace(/-/g, '');
    const isValidTin = /^[0-9]{9}$/.test(cleanedTIN) || /^[0-9]{12}$/.test(cleanedTIN);

    return isValidTin;
}

export const validate_file = (file, type, fieldName, setter, setError, setHelper) => {
    const filereader = new FileReader();
    const valid_img = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif';
    const valid_doc = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword';
    
    let validation;
    if (type === 'image') {
        validation = valid_img;
    } else if (type === 'file') {
        validation = valid_doc;
    } else {
        toast.error('Not a valid type of format.');
    }

    if (file) {
        filereader.readAsDataURL(file);
        if (validation) {
            if (file.size <= parseInt((5 * 1024) * 1024)) { // minimum of 5MB
                filereader.onloadend = function(e) {
                    setData(setter, fieldName, file);
                    setData(setter, `${fieldName}_name`, file.name);
                    setErrorHelper(`${fieldName}_name`, false, '', setError, setHelper);
                }
            } else {
                setData(setter, fieldName, '');
                setData(setter, `${fieldName}_name`, '');
                setErrorHelper(`${fieldName}_name`, true, 'File size limit is 5MB, please select another file.', setError, setHelper);
                toast.error('File size limit is only 5MB');
            }
        } else {
            const helper_msg = type === 'image' ? 'Please select a valid image file (png, jpg, jpeg or gif)' : '.pdf, .doc or .docx file are only allowed';
            const toast_msg = type === 'image' ? '.png, .jpg, .jpeg or .gif are only allowed' : '.pdf, .doc or .docx file are only allowed';
            setData(setter, fieldName, '');
            setData(setter, `${fieldName}_name`, '');
            setErrorHelper(`${fieldName}_name`, true, helper_msg, setError, setHelper);
            toast.error(toast_msg);
        }
    } else {
        console.log('No file detected.');
    }
};

// validate file upload while previewing its uploaded file.
export const validate_image_preview = (file, fieldName, displaySetter, setter, setError, setHelper) => {
    const filereader = new FileReader();
    const valid_img = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif';

    if (file) {
        filereader.readAsDataURL(file);
        if (valid_img) {
            if (file.size <= parseInt((5 * 1024) * 1024)) { // minimum of 5MB
                filereader.onloadend = function(e) {
                    // preview the uploaded image
                    displaySetter(filereader.result);

                    setData(setter, fieldName, file);
                    setData(setter, `${fieldName}_name`, file.name);
                    setErrorHelper(`${fieldName}_name`, false, '', setError, setHelper);
                }
            } else {
                setData(setter, fieldName, '');
                setData(setter, `${fieldName}_name`, '');
                setErrorHelper(`${fieldName}_name`, true, 'File size limit is 5MB, please select another file.', setError, setHelper);
                toast.error('File size limit is only 5MB');
            }
        } else {
            const helper_msg = 'Please select a valid image file (png, jpg, jpeg or gif)';
            const toast_msg = '.png, .jpg, .jpeg or .gif are only allowed';
            setData(setter, fieldName, '');
            setData(setter, `${fieldName}_name`, '');
            setErrorHelper(`${fieldName}_name`, true, helper_msg, setError, setHelper);
            toast.error(toast_msg);
        }
    } else {
        console.log('No file detected.');
    }
};

export const downloadWithType = async (url, id, type) => {
    try {
        window.open(`${url}${type}/${id}`);
    } catch (error) {
        toast.error('Oops, something went wrong. Please try again later.');
    }   
};

const selectItemsEntity = (state, entity) => { return state.itemReducer.items[entity] || [] }
export const makeSelectRowsEntity = () => createSelector(
    [selectItemsEntity],
    (items) => {
        // Memoize the filtering to avoid new references
        return items.filter(item => nullCheck(item.deleted_at));  // Example: Filter only active items
    }
);