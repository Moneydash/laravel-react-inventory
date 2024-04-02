import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { DatePicker, LocalizationProvider, MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React, { useState } from "react";

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

const SelectCmp = ({ id, value, label, onChange, items, size, name, error }) => {
    return (
        <FormControl fullWidth size={size}>
            <InputLabel id={id}>{items?.length > 0 ? label : 'Loading ...'}</InputLabel>
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
                    // console.log('Selected: ', selected);
                    return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value, index) => (
                                <Chip
                                    key={index}
                                    label={items.find(item => item?.id === value || item?.value === value)?.name ?? ''}
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

export { DatePickerCmp, TimePickerCmp, SelectCmp, MultipleSelectCmp };