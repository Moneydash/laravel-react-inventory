import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import React from "react";

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

export { DatePickerCmp };