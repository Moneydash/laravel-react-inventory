import { InsertDriveFileOutlined } from "@mui/icons-material";
import { Divider, Grid, TextField, Typography } from "@mui/material";
import { MultipleSelectCmp, SelectCmp, TimePickerCmp } from "components/elements/FieldComponents";
import FileUploadCmp from "components/elements/FileUploadComponent";
import React from "react";

const AddUpdateContent = ({
    form,
    formError,
    formHelper,
    handleChange,
    categories,
    equipments,
    warehouseTypes,
    handleOpeningHrs,
    handleClosingHrs
}) => {
    const week = [
        { id: 'monday', name: 'Every Monday' },
        { id: 'tuesday', name: 'Every Tuesday' },
        { id: 'wednesday', name: 'Every Wednesday' },
        { id: 'thursday', name: 'Every Thursday' },
        { id: 'friday', name: 'Every Friday' },
        { id: 'saturday', name: 'Every Saturday' },
        { id: 'sunday', name: 'Every Sunday' }
    ];

    const is_bio = [
        { id: 2, name: 'No' },
        { id: 1, name: 'Yes' }
    ];
    return(
        <div>
            <Typography variant="body1" sx={{ mb: 1.5, mt: -1 }}>Primary Information</Typography>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mb: 3 }}>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Warehouse Name *"
                        placeholder="Name of the Warehouse (Required)"
                        fullWidth
                        size="small"
                        name="name"
                        value={form.name}
                        error={formError.name}
                        helperText={formHelper.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Warehouse Size *"
                        placeholder="Size of the Warehouse (Required)"
                        fullWidth
                        size="small"
                        name="size_area"
                        value={form.size_area}
                        error={formError.size_area}
                        helperText={formHelper.size_area}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <SelectCmp
                        id="warehouse_type_id"
                        label="Warehouse Type *"
                        items={warehouseTypes}
                        size="small"
                        name="warehouseType_id"
                        value={form?.warehouseType_id}
                        error={formError.warehouseType_id}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Warehouse Location *"
                        placeholder="Location of Warehouse (Required)"
                        fullWidth
                        size="small"
                        name="location"
                        value={form.location}
                        error={formError.location}
                        helperText={formHelper.location}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Warehouse Landmark *"
                        placeholder="Landmark of Warehouse (Required)"
                        fullWidth
                        size="small"
                        name="landmark"
                        value={form.landmark}
                        error={formError.landmark}
                        helperText={formHelper.landmark}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Point of Contact *"
                        placeholder="Contact Person (Required)"
                        fullWidth
                        size="small"
                        name="contact_person"
                        value={form.contact_person}
                        error={formError.contact_person}
                        helperText={formHelper.contact_person}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Mobile Number *"
                        placeholder="Point of Contact Mobile (Required)"
                        fullWidth
                        size="small"
                        name="person_conno"
                        value={form.person_conno}
                        error={formError.person_conno}
                        helperText={formHelper.person_conno}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Description"
                        placeholder="Description of Warehouse (Optional)"
                        fullWidth
                        size="small"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12} sx={{ mt: -1 }}>
                    <TimePickerCmp
                        label="Opening Hours"
                        name="opening_hrs"
                        size="small"
                        value={form.opening_hrs}
                        error={formError.opening_hrs}
                        helperText={formHelper.opening_hrs}
                        onChange={handleOpeningHrs}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12} sx={{ mt: -1 }}>
                    <TimePickerCmp
                        label="Closing Hours"
                        name="closing_hrs"
                        size="small"
                        value={form.closing_hrs}
                        error={formError.closing_hrs}
                        helperText={formHelper.closing_hrs}
                        onChange={handleClosingHrs}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Warehouse Hotline"
                        placeholder="Hotline of Warehouse (Required)"
                        fullWidth
                        size="small"
                        type="number"
                        name="hotline"
                        value={form.hotline}
                        error={formError.hotline}
                        helperText={formHelper.hotline}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={3} xl={3} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Warehouse Email"
                        placeholder="Email of Warehouse (Required)"
                        fullWidth
                        size="small"
                        name="email"
                        value={form.email}
                        error={formError.email}
                        helperText={formHelper.email}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            <Divider variant="middle"><Typography variant="body1">Additional Information</Typography></Divider>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mt: .5 }}>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <FileUploadCmp
                        placeholder="Insurance Info (Required)"
                        accept=".pdf, .docx, .doc"
                        endIcon={<InsertDriveFileOutlined />}
                        size="small"
                        name="insurance_info"
                        fileName="insurance_info_name"
                        fileNameError={formError.insurance_info_name}
                        fileNameHelperText={formHelper.insurance_info_name}
                        fileNameValue={form.insurance_info_name}
                        handleChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <FileUploadCmp
                        placeholder="Certifications / Compliance (Required)"
                        accept=".pdf, .docx, .doc"
                        endIcon={<InsertDriveFileOutlined />}
                        size="small"
                        name="certifications_compliance"
                        fileName="certifications_compliance_name"
                        fileNameError={formError.certifications_compliance_name}
                        fileNameHelperText={formHelper.certifications_compliance_name}
                        fileNameValue={form.certifications_compliance_name}
                        handleChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        label="Minimum Temperature"
                        placeholder="Minimum Temperature of the Warehouse (Optional)"
                        fullWidth
                        size="small"
                        name="min_temp"
                        value={form.min_temp}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        label="Maximum Temperature"
                        placeholder="Maximum Temperature of the Warehouse (Optional)"
                        fullWidth
                        size="small"
                        name="max_temp"
                        value={form.max_temp}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <MultipleSelectCmp
                        id="categories"
                        label="Suitable Categories"
                        size="small"
                        items={categories}
                        name="categories"
                        value={form.categories}
                        error={formError.categories}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <MultipleSelectCmp
                        id="categories"
                        label="Available Equipments"
                        size="small"
                        items={equipments}
                        name="equipments"
                        value={form.equipments}
                        error={formError.equipments}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <SelectCmp
                        id="maintenance-schedule"
                        label="Maintenance Schedule"
                        size="small"
                        items={week}
                        name="maintenance_schedule"
                        value={form.maintenance_schedule}
                        error={formError.maintenance_schedule}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <FileUploadCmp
                        placeholder="Vendor Contract (Required)"
                        accept=".pdf, .docx, .doc"
                        endIcon={<InsertDriveFileOutlined />}
                        size="small"
                        name="vendor_contracts"
                        fileName="vendor_contracts"
                        fileNameError={formError.vendor_contracts_name}
                        fileNameHelperText={formHelper.vendor_contracts_name}
                        fileNameValue={form.vendor_contracts_name}
                        handleChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <SelectCmp
                        id="is_biohazard"
                        label="Is Biohazard?"
                        items={is_bio}
                        size="small"
                        name="is_biohazard"
                        value={form.is_biohazard}
                        error={formError.is_biohazard}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Precautionary Measures"
                        placeholder="Precautionary Measures (Required if Biohazard)"
                        fullWidth
                        size="small"
                        InputProps={{
                            readOnly: form?.is_biohazard === 1 ? false : true
                        }}
                        name="precautionary_measure"
                        value={form.precautionary_measure}
                        error={formError.precautionary_measure}
                        helperText={formHelper.precautionary_measure}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Facecbook Page"
                        placeholder="Facebook Page/Link (Optional)"
                        fullWidth
                        size="small"
                        name="facebook_link"
                        value={form.facebook_link}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Twitter Page"
                        placeholder="Twitter Page/Link (Optional)"
                        fullWidth
                        size="small"
                        name="twitter_link"
                        value={form.twitter_link}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Usage"
                        placeholder="Warehouse Usage (Required) e.g. Temporary Storage"
                        fullWidth
                        size="small"
                        name="usage"
                        value={form.usage}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        variant="outlined"
                        label="Special Info"
                        placeholder="Special Handling Info (Optional)"
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={10}
                        name="special_handling_info"
                        value={form.special_handling_info}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default AddUpdateContent;