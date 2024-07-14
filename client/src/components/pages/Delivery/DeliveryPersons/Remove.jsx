import { CancelOutlined, PersonRemoveAlt1Outlined } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import { ErrorColorLoadingBtn, PrimaryColorBtn } from "components/elements/ButtonsComponent";
import React from "react";

const Remove = ({
    removeDialog,
    handleRemoveDialog,
    handleRemoveSubmit,
    loading
}) => {
    return (
        <Dialog open={removeDialog} onClose={() => handleRemoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Remove Delivery Personnel Details</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to remove this Delivery Personnel?</Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mr: 1.5, mb: 1 }}>
                        <Grid item>
                            <PrimaryColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined />}
                                onClick={() => handleRemoveDialog(false)}
                            />
                        </Grid>
                        <Grid item>
                            <ErrorColorLoadingBtn
                                displayText={loading ? 'Removing Delivery Personnel' : 'Remove Delivery Personnel'}
                                endIcon={<PersonRemoveAlt1Outlined />}
                                onClick={handleRemoveSubmit}
                                loading={loading}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
    );
};

export default Remove;