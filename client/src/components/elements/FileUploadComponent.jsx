import { Button, InputAdornment, TextField } from "@mui/material";
import React from "react";
import VisuallyHidden from "./FileInputComponent";
import PropTypes from "prop-types";

const FileUploadCmp = ({
    name,
    fileName,
    fileNameError,
    fileNameHelperText,
    fileNameValue,
    placeholder,
    accept,
    endIcon,
    disabled,
    handleChange,
    size
}) => {
    return (
        <TextField
            variant="outlined"
            fullWidth
            name={fileName}
            error={fileNameError}
            helperText={fileNameHelperText}
            placeholder={placeholder}
            value={fileNameValue ? `C:\\fakepath\\${fileNameValue}` : ''}
            size={size}
            InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                    <Button
                        variant="text"
                        color="primary"
                        sx={{ ml: -1 }}
                        component="label"
                        disabled={disabled}
                        size={size}
                    >
                        Upload File
                        <VisuallyHidden type="file" name={name} accept={accept} onChange={handleChange} />
                    </Button>
                </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">{endIcon}</InputAdornment>,
                readOnly: true
            }}
        />
    );
};

FileUploadCmp.propTypes = {
    name: PropTypes.string,
    fileName: PropTypes.string,
    fileNameError: PropTypes.bool,
    fileNameHelperText: PropTypes.string,
    fileNameValue: PropTypes.string,
    placeholder: PropTypes.string,
    accept: PropTypes.string,
    endIcon: PropTypes.element,
    disabled: PropTypes.bool,
    handleChange: PropTypes.func,
    size: PropTypes.string
};

FileUploadCmp.defaultProps = {
    name: '',
    fileName: '',
    fileNameError: false,
    fileNameHelperText: '',
    fileNameValue: null,
    placeholder: '',
    accept: "*",
    endIcon: '',
    disabled: false,
    handleChange: () => {},
    size: 'medium'
};

export default FileUploadCmp;