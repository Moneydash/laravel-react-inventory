import { LoadingButton } from "@mui/lab";
import { Button, IconButton, Tooltip } from "@mui/material";
import React from "react";
import PropTypes from 'prop-types';

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
};

const SuccessColorBtn = ({ displayText, endIcon, onClick }) => {
    return (
        <Button color="success" variant="contained" endIcon={endIcon} onClick={onClick}>
            { displayText }
        </Button>
    );
};

const PrimaryColorLoadingBtn = ({ displayText, endIcon, onClick, loading, sx }) => {
    return (
        <LoadingButton loading={loading} variant="contained" loadingPosition="end" color="primary" endIcon={endIcon} onClick={onClick} sx={{ ...sx }}>
            { displayText }
        </LoadingButton>
    );
};

const ErrorColorLoadingBtn = ({ displayText, endIcon, onClick, loading, sx }) => {
    return (
        <LoadingButton loading={loading} variant="contained" loadingPosition="end" color="error" endIcon={endIcon} onClick={onClick} sx={{ ...sx }}>
            { displayText }
        </LoadingButton>
    );
};

const PrimaryColorIconBtn = ({ fn, title, icon, disabled, sx }) => {
    return (
        <IconButton onClick={fn} color="primary" disabled={disabled} sx={{ ...sx }}>
            <Tooltip title={title} placement="bottom" arrow>{icon}</Tooltip>
        </IconButton>
    );
};

const ErrorColorIconBtn = ({ fn, title, icon, disabled, sx }) => {
    return (
        <IconButton onClick={fn} color="error" disabled={disabled} sx={{ ...sx }}>
            <Tooltip title={title} placement="bottom" arrow>{icon}</Tooltip>
        </IconButton>
    );
};

PrimaryColorLoadingBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {},
    loading: false,
    sx: {}
};

PrimaryColorLoadingBtn.propTypes = {
    displayText: PropTypes.string,
    endIcon: PropTypes.element,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    sx: PropTypes.object
};

ErrorColorLoadingBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {},
    loading: false
};

ErrorColorLoadingBtn.propTypes = {
    displayText: PropTypes.string,
    endIcon: PropTypes.element,
    onClick: PropTypes.func,
    loading: PropTypes.bool
};

ErrorColorBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {}
};

ErrorColorBtn.propTypes = {
    displayText: PropTypes.string,
    endIcon: PropTypes.element,
    onClick: PropTypes.func
};

PrimaryColorBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {}
};

PrimaryColorBtn.propTypes = {
    displayText: PropTypes.string,
    endIcon: PropTypes.element,
    onClick: PropTypes.func
};

SuccessColorBtn.defaultProps = {
    displayText: '',
    endIcon: '',
    onClick: () => {}
};

SuccessColorBtn.propTypes = {
    displayText: PropTypes.string,
    endIcon: PropTypes.element,
    onClick: PropTypes.func
};

PrimaryColorIconBtn.defaultProps = {
    fn: () => {},
    title: '',
    icon: '',
    disabled: false,
    sx: {},
};

PrimaryColorIconBtn.propTypes = {
    fn: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.element,
    disabled: PropTypes.bool,
    sx: PropTypes.object
};

ErrorColorIconBtn.defaultProps = {
    fn: () => {},
    title: '',
    icon: '',
    disabled: false,
    sx: {}
};

ErrorColorIconBtn.propTypes = {
    fn: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.element,
    disabled: PropTypes.bool,
    sx: PropTypes.object
};

export {
    PrimaryColorBtn,
    ErrorColorBtn,
    SuccessColorBtn,
    PrimaryColorLoadingBtn,
    ErrorColorLoadingBtn,
    PrimaryColorIconBtn,
    ErrorColorIconBtn
};