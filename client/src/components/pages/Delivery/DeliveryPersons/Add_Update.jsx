import { AttachmentOutlined } from "@mui/icons-material";
import { Grid, TextField } from "@mui/material";
import { SelectCmp } from "components/elements/FieldComponents";
import FileUploadCmp from "components/elements/FileUploadComponent";
import React from "react";
import { nullCheck } from "utils/helper";

const AddUpdateContent = ({
    formData,
    formDataError,
    formDataHelperText,
    handleChange,
    editIndex,
    primaryIds,
    primaryIdImgPreview,
    secondaryIds,
    secondaryIdImgPreview
}) => {
    return (
        <>
            <Grid container direction="row" rowSpacing={2.5} columnSpacing={2}>
                <Grid item lg={6} xl={6}>
                    <Grid container direction="column" rowSpacing={2.5}>
                        <Grid item>
                            <TextField
                                label="First Name"
                                variant="outlined"
                                name="firstname"
                                placeholder="First Name of the Delivery Personnel (Required)"
                                value={formData.firstname}
                                error={formDataError.firstname}
                                helperText={formDataHelperText.firstname}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    readOnly: editIndex === 2 ? true : false
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Middle Name / Initial"
                                variant="outlined"
                                name="middlename"
                                value={formData.middlename}
                                placeholder="Middle Name / Initial of Delivery Personnel (Optional)"
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: editIndex === 2 ? true : false
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                name="lastname"
                                placeholder="Last Name of the Delivery Personnel (Required)"
                                value={formData.lastname}
                                error={formDataError.lastname}
                                helperText={formDataHelperText.lastname}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: editIndex === 2 ? true : false
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <SelectCmp
                                id="primaryID_id"
                                value={primaryIds?.length > 0 ? formData.primaryID_id || '' : ''}
                                label="Primary ID (Required)"
                                onChange={handleChange}
                                items={primaryIds}
                                name="primaryID_id"
                                error={formDataError.primaryID_id}
                                noItemsText="Loading Primary ID options ..."
                                readOnly={editIndex === 2 ? true : false}
                            />
                        </Grid>
                        <Grid item>
                            <FileUploadCmp
                                name="primary_id_img"
                                fileName="primary_id_img_filename"
                                fileNameError={formDataError.primary_id_img_name}
                                fileNameHelperText={formDataHelperText.primary_id_img_name}
                                fileNameValue={formData.primary_id_img_name}
                                placeholder="Primary ID of the delivery personnel (Required)"
                                accept=".png, .jpg, .jpeg, .gif"
                                endIcon={<AttachmentOutlined />}
                                handleChange={handleChange}
                                disabled={editIndex === 2 ? true : false}
                            />
                            {primaryIdImgPreview && (
                                <div>{primaryIdImgPreview()}</div>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={6} xl={6}>
                    <Grid container direction="column" rowSpacing={2.5}>
                        <Grid item>
                            <TextField
                                label="Contact Number"
                                variant="outlined"
                                name="contact_number"
                                placeholder="Contact Number of the Delivery Personnel (Required)"
                                value={formData.contact_number}
                                error={formDataError.contact_number}
                                helperText={formDataHelperText.contact_number}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: editIndex === 2 ? true : false
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="E-mail Address"
                                placeholder="E-mail address of the Delivery Personnel (Optional)"
                                variant="outlined"
                                name="email_address"
                                type="email"
                                value={formData.email_address}
                                error={formDataError.email_address}
                                helperText={formDataHelperText.email_address}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: editIndex === 2 ? true : false
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <SelectCmp
                                id="secondaryID-id"
                                label="Secondary ID (Optional)"
                                value={secondaryIds?.length > 0 ? formData.secondaryID_id || '' : ''}
                                onChange={handleChange}
                                items={secondaryIds}
                                name="secondaryID_id"
                                noItemsText="Loading Secondary ID options ..."
                                readOnly={editIndex === 2 ? true : false}
                            />
                        </Grid>
                        <Grid item>
                            <FileUploadCmp
                                name="secondary_id_img"
                                fileName="secondary_id_img_name"
                                fileNameError={formDataError.secondary_id_img_name}
                                fileNameHelperText={formDataHelperText.secondary_id_img_name}
                                fileNameValue={formData.secondary_id_img_name}
                                placeholder="Secondary ID of the Delivery Personnel (Optional)"
                                accept=".png, .jpg, .jpeg, .gif"
                                endIcon={<AttachmentOutlined />}
                                handleChange={handleChange}
                                disabled={nullCheck(formData.secondaryID_id) || editIndex === 2 ? true : false}
                            />
                            {secondaryIdImgPreview && (
                                <div>{secondaryIdImgPreview()}</div>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={12} xl={12}>
                    <TextField
                        label="Home Address"
                        variant="outlined"
                        multiline
                        rows={3}
                        fullWidth
                        name="home_address"
                        value={formData.home_address}
                        error={formDataError.home_address}
                        helperText={formDataHelperText.home_address}
                        onChange={handleChange}
                        InputProps={{
                            readOnly: editIndex === 2 ? true : false
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default AddUpdateContent;