import { InsertDriveFileOutlined } from "@mui/icons-material";
import { Grid, TextField } from "@mui/material";
import { DatePickerCmp } from "components/elements/FieldComponents";
import FileUploadCmp from "components/elements/FileUploadComponent";
import React from "react";

const AddUpdateContent = ({
    formData,
    formDataError,
    formDataHelperText,
    handleChange,
    handleDateChange
}) => {
    return (
        <>
            <Grid container direction="column" rowSpacing={2}>
                <Grid item>
                    <TextField
                        variant="outlined"
                        placeholder="Name of Supplier"
                        label="Supplier Name"
                        name="name"
                        value={formData.name}
                        error={formDataError.name}
                        helperText={formDataHelperText.name}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        placeholder="Location of Supplier"
                        label="Supplier Location"
                        name="location"
                        value={formData.location}
                        error={formDataError.location}
                        helperText={formDataHelperText.location}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        placeholder="Email of Supplier"
                        label="Supplier Email"
                        name="email"
                        value={formData.email}
                        error={formDataError.email}
                        type="email"
                        helperText={formDataHelperText.email}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        placeholder="Hotline of Supplier"
                        label="Supplier Hotline"
                        name="hotline"
                        value={formData.hotline}
                        error={formDataError.hotline}
                        type="number"
                        helperText={formDataHelperText.hotline}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        placeholder="Point of Contact"
                        label="Contact Person"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        error={formDataError.contact_person}
                        helperText={formDataHelperText.contact_person}
                        fullWidth
                    />
                </Grid>
                <Grid item>
                    <TextField
                        variant="outlined"
                        placeholder="Mobile Number of Contact Person"
                        label="Contact Person Mobile Number"
                        value={formData.contact_person_number}
                        onChange={handleChange} name="contact_person_number"
                        error={formDataError.contact_person_number}
                        helperText={formDataHelperText.contact_person_number}
                        fullWidth
                    />
                </Grid>
                <Grid item lg={12} xl={12}>
                    <DatePickerCmp
                        onChange={handleDateChange}
                        label="Contract Expiry Date"
                        name="contract_expiry_date"
                        value={formData.contract_expiry_date}
                        helperText={formDataHelperText.contract_expiry_date}
                        error={formDataError.contract_expiry_date}
                    />
                </Grid>
                <Grid container mt={3} columnSpacing={{ lg: 2, xl: 2 }}>
                    <Grid item xl={6} lg={6}>
                        <FileUploadCmp
                            name="terms"
                            fileName="terms_name"
                            fileNameError={formDataError.terms_name}
                            fileNameHelperText={formDataHelperText.terms_name}
                            placeholder="Terms and Conditions"
                            fileNameValue={formData.terms_name}
                            accept=".pdf, .docx, .doc"
                            endIcon={<InsertDriveFileOutlined />}
                            handleChange={handleChange}
                        />
                    </Grid>
                    <Grid item xl={6} lg={6} sm={6}>
                        <FileUploadCmp
                            name="agreement"
                            fileName="agreement_name"
                            fileNameError={formDataError.agreement_name}
                            fileNameHelperText={formDataHelperText.agreement_name}
                            placeholder="Contract Agreement"
                            fileNameValue={formData.agreement_name}
                            accept=".pdf, .docx, .doc"
                            endIcon={<InsertDriveFileOutlined />}
                            handleChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default AddUpdateContent;