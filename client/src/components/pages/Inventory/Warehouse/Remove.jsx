import { CancelOutlined, DomainDisabledOutlined } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import { ErrorColorLoadingBtn, PrimaryColorBtn } from "components/elements/ButtonsComponent";
import React from "react";

const Remove = ({ removeDialog, handleRemove, setRemoveDialog, loading }) => {
    return (
        <Dialog open={removeDialog} fullWidth maxWidth="sm">
            <DialogTitle>Warehouse Removal</DialogTitle>
            <Divider />
            <DialogContent>
                <Typography variant="body1">Are you sure you want to remove this warehouse on your warehouse lists?</Typography>
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                    <Grid item>
                        <ErrorColorLoadingBtn
                            displayText={loading ? 'Removing Warehouse' : 'Remove Warehouse'}
                            endIcon={<DomainDisabledOutlined fontSize="small" />}
                            loading={loading}
                            onClick={handleRemove}
                        />
                    </Grid>
                    <Grid item>
                        <PrimaryColorBtn
                            displayText="Cancel"
                            endIcon={<CancelOutlined fontSize="small" />}
                            onClick={() => setRemoveDialog(false)}
                        />
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
}

export default Remove;