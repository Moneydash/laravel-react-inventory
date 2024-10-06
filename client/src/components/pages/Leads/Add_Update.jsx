import { Divider, Grid, TextField, Typography } from "@mui/material";
import { SelectCmp } from "components/elements/FieldComponents";
import React from "react";

const AddUpdateContent = ({
    data,
    errors,
    helpers,
    leadSources,
    industryTypes,
    jobRoles,
    onChange
}) => {
    const leadStatus = [
        { id: 'new', name: 'New' },
        { id: 'in-progress', name: 'In Progress' },
        { id: 'contacted', name: 'Contacted' },
        { id: 'qualified', name: 'Qualified' },
        { id: 'unqualified', name: 'Unqualified' },
        { id: 'converted', name: 'Converted' }
    ];
    return (
        <>
            <Typography variant="body1" sx={{ mb: 2, mt: -1 }}>Primary Information</Typography>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mb: 3 }}>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="firstname"
                        label="First Name *"
                        placeholder="Firstname of the Lead (Required)"
                        value={data.firstname}
                        error={errors.firstname}
                        helperText={helpers.firstname}
                        onChange={onChange}
                        fullWidth
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="lastname"
                        label="Last Name *"
                        placeholder="Lastname of the Lead (Required)"
                        value={data.lastname}
                        error={errors.lastname}
                        helperText={helpers.lastname}
                        onChange={onChange}
                        fullWidth
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="email"
                        label="E-mail *"
                        placeholder="E-mail of the Lead (Required)"
                        value={data.email}
                        error={errors.email}
                        helperText={helpers.email}
                        onChange={onChange}
                        fullWidth
                        type="email"
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="contact_num"
                        label="Contact Number *"
                        placeholder="Contact Number of the Lead (Required)"
                        value={data.contact_num}
                        error={errors.contact_num}
                        helperText={helpers.contact_num}
                        onChange={onChange}
                        fullWidth
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="lead_owner"
                        label="Lead Organization *"
                        placeholder="Lead Owner (Name or Organization - Required)"
                        value={data.lead_owner}
                        error={errors.lead_owner}
                        helperText={helpers.lead_owner}
                        onChange={onChange}
                        fullWidth
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <SelectCmp
                        id="lead-source-id"
                        value={data.lead_source_id}
                        label="Lead Source *"
                        items={leadSources}
                        name="lead_source_id"
                        error={errors.lead_source_id}
                        noItemsText="Loading Sources..."
                        onChange={onChange}
                    />
                </Grid>
            </Grid>
            <Divider><Typography variant="body1">Additional Informations</Typography></Divider>
            <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2} sx={{ mt: .5 }}>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="company_name"
                        label="Company Name"
                        placeholder="Lead Company / Working company of Lead (Optional)"
                        value={data.company_name}
                        onChange={onChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <SelectCmp
                        id="industry-type-id"
                        value={data.industry_type_id}
                        label="Type of Industry *"
                        items={industryTypes}
                        name="industry_type_id"
                        error={errors.industry_type_id}
                        noItemsText="Loading Industries..."
                        onChange={onChange}
                        size="small"
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <SelectCmp
                        id="job-title-id"
                        value={data.job_title_id}
                        label="Job Title *"
                        items={jobRoles}
                        name="job_title_id"
                        error={errors.industry_type_id}
                        noItemsText="Loading Job Titles..."
                        size="small"
                        onChange={onChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="website"
                        label="Website"
                        placeholder="Lead Website"
                        value={data.website}
                        onChange={onChange}
                        fullWidth
                        size="small"
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <TextField
                        name="campaign"
                        label="Campaign"
                        fullWidth
                        size="small"
                        placeholder="Campaign Marketing or Events"
                        value={data.campaign}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item lg={6} xl={6} sm={12} xs={12}>
                    <SelectCmp
                        id="lead-status"
                        value={data.lead_status}
                        label="Lead Status *"
                        items={leadStatus}
                        name="lead_status"
                        error={errors.lead_status}
                        noItemsText="Loading Status..."
                        onChange={onChange}
                        size="small"
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        name="interests"
                        label="Lead Interests"
                        fullWidth
                        size="small"
                        multiline
                        maxRows={8}
                        minRows={3}
                        value={data.interests}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        name="notes"
                        label="Lead Notes"
                        fullWidth
                        size="small"
                        multiline
                        maxRows={8}
                        minRows={3}
                        value={data.notes}
                        onChange={onChange}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default AddUpdateContent;