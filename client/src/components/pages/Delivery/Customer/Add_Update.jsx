import { Divider, Grid, TextField, Typography } from "@mui/material";
import { SelectCmp } from "components/elements/FieldComponents";
import React from "react";

const AddUpdateContent = ({
    formData,
    formDataError,
    formDataHelperText,
    handleChange,
    customerTypes,
    industryTypes
}) => {
    const hasCompany = [
        { id: 0, name: 'No' },
        { id: 1, name: 'Yes' }        
    ];
    const companySizes = [
        { id: '1-50', name: '1 - 50 Employees' },
        { id: '50-100', name: '50 - 100 Employees' },
        { id: '100 - 1000', name: '100 - 1000 Employees' },
        { id: '1000 or more', name: '1000 or more Employees' }
    ];

    return (
        <>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mb: 3 }}>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        label="First Name"
                        name="firstname"
                        value={formData.firstname}
                        error={formDataError.firstname}
                        helperText={formDataHelperText.firstname}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        placeholder="First Name of Customer (Required)"
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        label="Middle"
                        placeholder="Middle of the Customer (Optional)"
                        name="middlename"
                        value={formData.middlename}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        label="Last Name"
                        name="lastname"
                        placeholder="Last Name of the Customer (Required)"
                        value={formData.lastname}
                        error={formDataError.lastname}
                        helperText={formDataHelperText.lastname}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        label="Contact Number"
                        name="contact_number"
                        placeholder="Contact Number of the Customer (Required)"
                        value={formData.contact_number}
                        error={formDataError.contact_number}
                        helperText={formDataHelperText.contact_number}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        label="E-mail Address"
                        name="email"
                        placeholder="Email of the Customer (Required)"
                        value={formData.email}
                        error={formDataError.email}
                        helperText={formDataHelperText.email}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        type="email"
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <SelectCmp
                        id="customer-type"
                        label="Customer Type"
                        items={customerTypes}
                        size="small"
                        name="customer_type_id"
                        value={formData.customer_type_id}
                        error={formDataError.customer_type_id}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        name="billing_address"
                        label="Billing Address"
                        placeholder="Billing Address of Customer (Required)"
                        value={formData.billing_address}
                        error={formDataError.billing_address}
                        helperText={formDataHelperText.billing_address}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        name="shipping_address"
                        label="Shipping Address"
                        placeholder="Shipping Address of Customer (Required)"
                        value={formData.shipping_address}
                        error={formDataError.shipping_address}
                        helperText={formDataHelperText.shipping_address}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={4} xl={4} sm={4} xs={4}>
                    <TextField
                        name="tin"
                        label="TIN"
                        placeholder="TIN of the Customer (Required)"
                        value={formData.tin}
                        error={formDataError.tin}
                        helperText={formDataHelperText.tin}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            <Divider variant="middle">
                <Typography variant="body1">Additional Information</Typography>
            </Divider>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mt: .5, mb: 3 }}>
                <Grid item lg={6} xl={6} sm={6} xs={6}>
                    <TextField
                        label="Customer Location"
                        name="customer_location"
                        placeholder="Location of Customer (Required)"
                        value={formData.customer_location}
                        error={formDataError.customer_location}
                        helperText={formDataHelperText.customer_location}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={6}>
                    <TextField
                        label="Customer Notes"
                        name="customer_notes"
                        placeholder="Important notes for Customer (Optional)"
                        value={formData.customer_notes}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={6}>
                    <TextField
                        label="Website"
                        name="website"
                        placeholder="Customer Website (Optional)"
                        value={formData.website}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={6}>
                    <TextField
                        label="Social Link"
                        name="social_link"
                        placeholder="Social Link of Customer (Optional)"
                        value={formData.social_link}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={6} xs={6}>
                    <SelectCmp
                        id="has-company"
                        value={formData.has_company}
                        label="Has Company"
                        items={hasCompany}
                        size="small"
                        name="has_company"
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            {formData.has_company === 1 ? (
                <>
                    <Divider variant="middle">
                        <Typography variant="body1">Company Information</Typography>
                    </Divider>
                    <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mt: .5 }}>
                        <Grid item xl={12} lg={12} sm={12} xs={12}>
                            <SelectCmp
                                id="industry-type"
                                value={formData.industry_type_id}
                                label="Industry Type"
                                items={industryTypes}
                                onChange={handleChange}
                                name="industry_type_id"
                            />
                        </Grid>
                        <Grid item xl={12} lg={12} sm={12} xs={12}>
                            <SelectCmp
                                id="company-size"
                                value={formData.company_size}
                                label="Company Size"
                                items={companySizes}
                                onChange={handleChange}
                                name="company_size"
                            />
                        </Grid>
                        <Grid item xl={12} lg={12} sm={12} xs={12}>
                            <TextField
                                label="Years of Operation"
                                name="years"
                                placeholder="Company's year of Operation (Required)"
                                value={formData.years}
                                error={formDataError.years}
                                helperText={formDataHelperText.years}
                                fullWidth
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </>
            ) : ''}
        </>
    );
}

export default AddUpdateContent;