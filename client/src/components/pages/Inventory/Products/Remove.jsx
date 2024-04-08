import React from "react";
import {
    Dialog,
    DialogTitle,
    Divider,
    DialogContent,
    Typography,
    DialogActions,
    Grid
} from "@mui/material";
import { ErrorColorLoadingBtn, PrimaryColorBtn } from "components/elements/ButtonsComponent";
import { CancelOutlined, DeleteOutlineOutlined } from "@mui/icons-material";

const Remove = ({ removeDialog, setRemoveDialog, loading, handleRemove }) => {
    return (
        <Dialog open={removeDialog} onClose={() => setRemoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Product Removal</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">Are you sure want to remove this product on your products list?</Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 1, mb: 1 }}>
                        <Grid item>
                            <ErrorColorLoadingBtn
                                displayText={ loading
                                ? 'Removing Product'
                                : 'Remove Product' }
                                endIcon={<DeleteOutlineOutlined />}
                                onClick={handleRemove}
                                loading={loading}
                            />
                        </Grid>
                        <Grid item>
                            <PrimaryColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined />}
                                onClick={() => setRemoveDialog(false)}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
    );
}

export default Remove;