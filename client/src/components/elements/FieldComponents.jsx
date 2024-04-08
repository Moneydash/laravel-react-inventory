import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { DatePicker, LocalizationProvider, MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React from "react";
import PropTypes from "prop-types";

const DatePickerCmp = ({ onChange, label, name, value, helperText, error }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label={label}
                    onChange={onChange}
                    name={name}
                    value={value}
                    sx={{ width: '100%' }}
                    minDate={dayjs()}
                    slotProps={{
                        textField: {
                            helperText: helperText,
                            error: error
                        }
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}

const TimePickerCmp = ({ label, name, value, helperText, error, size, onChange }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
                <MobileTimePicker
                    label={label}
                    name={name}
                    value={value}
                    sx={{ width: '100%' }}
                    onChange={onChange}
                    openTo="minutes"
                    slotProps={{
                        textField: {
                            helperText: helperText,
                            error: error,
                            size: size
                        }
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
};

const SelectCmp = ({ id, value, label, onChange, items, size, name, error, noItemsText }) => {
    return (
        <FormControl fullWidth size={size}>
            <InputLabel id={id}>{items?.length > 0 ? label : noItemsText}</InputLabel>
            { items?.length > 0
            ? <Select
                labelId={id}
                id={id}
                value={value}
                label={label}
                onChange={onChange}
                name={name}
                size={size}
                sx={{ pt: size === "small" ? -1 : 0 }}
                error={error}
            >
                {items?.length > 0 ? items.map((item, index) => (
                    <MenuItem key={index} value={item?.id ?? ''}>
                        { item?.name }
                    </MenuItem>
                ))
                : <MenuItem value="">Loading ...</MenuItem>
                }
            </Select>
            : ''
            }
        </FormControl>
    );
}

const MultipleSelectCmp = ({ id, label, value, onChange, items, size, name, error }) => {    
    return (
        <FormControl fullWidth size={size}>
            <InputLabel id={id}>{label}</InputLabel>
            <Select
                labelId={id}
                id={id}
                multiple
                value={value}
                onChange={onChange}
                name={name}
                size={size}
                error={error}
                input={<OutlinedInput id={id} label={label} size={size} />}
                renderValue={(selected) => {
                    return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value, index) => (
                                <Chip
                                    key={index}
                                    label={items.find(item => item?.id === value || item?.value === value)?.name ?? ''}
                                    size={size}
                                    variant="outlined"
                                    color="primary"
                                />
                            ))}
                        </Box>
                    );
                }}
            >
            { items?.length > 0 ? items?.map((item, index) => (
                <MenuItem
                    key={index}
                    value={item?.value ? item?.value : item?.id}
                >
                    { item?.name ?? '' }
                </MenuItem>
            ))
            : <MenuItem value="">&nbsp;</MenuItem>
            }
            </Select>
        </FormControl>
    );
}

// default value of date picker
DatePickerCmp.defaultProps = {
    onChange: () => {},
    label: '',
    name: '',
    value: null,
    helperText: '',
    error: false
};

// prop types of datepicker
DatePickerCmp.propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.instanceOf(dayjs),
    helperText: PropTypes.string,
    error: PropTypes.bool
};

// default value of time picker
TimePickerCmp.defaultProps = {
    onChange: () => {},
    label: '',
    name: '',
    value: null,
    helperText: '',
    error: false,
    size: 'medium'
};

// prop types of timepicker
TimePickerCmp.propTypes = {
    onChange: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.instanceOf(dayjs),
    helperText: PropTypes.string,
    error: PropTypes.bool,
    size: PropTypes.string
};

// default value of select component
SelectCmp.defaultProps = {
    onChange: () => {},
    id: '',
    value: '',
    label: '',
    items: [],
    size: 'medium',
    name: '',
    error: false,
    noItemsText: 'Loading ...',
};

// prop types of select component
SelectCmp.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    label: PropTypes.string,
    items: PropTypes.array,
    size: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.bool,
    noItemsText: PropTypes.string
};

// default value of multiple select component
MultipleSelectCmp.defaultProps = {
    onChange: () => {},
    id: '',
    value: [],
    label: '',
    items: [],
    size: 'medium',
    name: '',
    error: false
};

// prop types of multiple select component
MultipleSelectCmp.propTypes = {
    onChange: PropTypes.func,
    id: PropTypes.string,
    value: PropTypes.array,
    label: PropTypes.string,
    items: PropTypes.array,
    size: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.bool
};

export { DatePickerCmp, TimePickerCmp, SelectCmp, MultipleSelectCmp };