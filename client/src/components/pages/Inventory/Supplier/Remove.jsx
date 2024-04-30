import { CancelOutlined, DeleteOutlineRounded } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import { ErrorColorLoadingBtn } from "components/elements/ButtonsComponent";
import React from "react";

const Remove = ({
    removeDialog,
    setRemoveDialog,
    loading,
    handleRemove
}) => {
    return (
        <Dialog open={removeDialog} onClose={() => setRemoveDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>Remove Supplier Partner</DialogTitle>
            <Divider />
            <DialogContent>
                <Typography variant="body1">The supplier partner will be removed, are you sure about this?</Typography>
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent="flex-end" sx={{ mr: 2, mb: 1 }} columnSpacing={{ lg: 1, xl: 1 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<CancelOutlined />}
                            onClick={() => setRemoveDialog(false)}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item>
                        <ErrorColorLoadingBtn
                            displayText={loading
                            ? 'Removing Supplier'
                            : 'Remove Supplier'}
                            endIcon={<DeleteOutlineRounded fontSize="small" />}
                            onClick={handleRemove}
                            loading={loading}
                        />
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default Remove;