import { Grid, TextField } from "@mui/material";
import React from "react";

const AddUpdateContent = ({
    form,
    formError,
    formHelper,
    handleChange
}) => {
    return (
        <>
            <Grid container rowSpacing={2}>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        label="Name"
                        placeholder="Category Name (Required)"
                        name="name"
                        value={form.name}
                        error={formError.name}
                        helperText={formHelper.name}
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        label="Slug"
                        placeholder="Slug (Required)"
                        name="slug"
                        value={form.slug}
                        error={formError.slug}
                        helperText={formHelper.slug}
                        fullWidth
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item lg={12} xl={12} sm={12} xs={12}>
                    <TextField
                        label="Description"
                        placeholder="Category Description (Optional)"
                        name="description"
                        value={form.description}
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={8}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default AddUpdateContent;