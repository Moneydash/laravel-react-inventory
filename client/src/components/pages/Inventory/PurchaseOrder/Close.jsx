import { CancelOutlined, FlagOutlined } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from "@mui/material";
import { ErrorColorBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import React from "react";

const CloseOrder = ({
    close_order,
    closeDialog,
    setCloseDialog,
    loading,
    id
}) => {
    return (
        <Dialog open={closeDialog} fullWidth maxWidth="sm">
            <DialogTitle>Order Completion</DialogTitle>
            <Divider />
            <DialogContent>
                <Typography variant="body1">Would you like to complete and close this purchase order?</Typography>
                <br />
                <Typography variant="body1"><b style={{ color: 'red' }}>Note</b>: Once you close this, you cannot approve nor disapprove purhase anymore.</Typography>
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                    <Grid item>
                        <PrimaryColorLoadingBtn
                            loading={loading}
                            displayText={loading ? 'Closing Purchase' : 'Close Purchase'}
                            endIcon={<FlagOutlined />}
                            onClick={() => close_order(id)}
                        />
                    </Grid>
                    <Grid item>
                        <ErrorColorBtn
                            displayText="Cancel"
                            endIcon={<CancelOutlined />}
                            onClick={() => setCloseDialog(false)}
                        />
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
}

export default CloseOrder;