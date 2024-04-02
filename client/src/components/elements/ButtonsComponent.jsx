import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import React from "react";

const PrimaryColorBtn = ({ displayText, endIcon, onClick }) => {
    return (
        <Button color="primary" variant="contained" endIcon={endIcon} onClick={onClick}>
            { displayText }
        </Button>
    );
};

const ErrorColorBtn = ({ displayText, endIcon, onClick }) => {
    return (
        <Button color="error" variant="contained" endIcon={endIcon} onClick={onClick}>
            { displayText }
        </Button>
    );
}

const SuccessColorBtn = ({ displayText, endIcon, onClick }) => {
    return (
        <Button color="success" variant="contained" endIcon={endIcon} onClick={onClick}>
            { displayText }
        </Button>
    );
}

const PrimaryColorLoadingBtn = ({ displayText, endIcon, onClick, loading }) => {
    return (
        <LoadingButton loading={loading} variant="contained" loadingPosition="end" color="primary" endIcon={endIcon} onClick={onClick}>
            { displayText }
        </LoadingButton>
    );
}

const ErrorColorLoadingBtn = ({ displayText, endIcon, onClick, loading }) => {
    return (
        <LoadingButton loading={loading} variant="contained" loadingPosition="end" color="error" endIcon={endIcon} onClick={onClick}>
            { displayText }
        </LoadingButton>
    );
}

PrimaryColorLoadingBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {},
    loading: false
};

ErrorColorLoadingBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {},
    loading: false
};

ErrorColorBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {},
};

PrimaryColorBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {},
};

SuccessColorBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {},
};

export { PrimaryColorBtn, ErrorColorBtn, SuccessColorBtn, PrimaryColorLoadingBtn, ErrorColorLoadingBtn };