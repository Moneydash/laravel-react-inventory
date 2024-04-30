import { CancelOutlined } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const DeletedContent = ({
    removerows,
    remove_columns,
    removeSupplierDialog,
    setRemoveSupplierDialog
}) => {
    return (
        <Dialog open={removeSupplierDialog} onClose={() => setRemoveSupplierDialog(false)} fullWidth maxWidth="md">
            <DialogTitle>List of Deleted Suppliers</DialogTitle>
            <Divider />
            <DialogContent>
                <DataGrid rows={removerows} columns={remove_columns} autoHeight />
            </DialogContent>
            <DialogActions>
                <Grid container justifyContent="flex-end" sx={{ mr: 2, mb: 1 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            endIcon={<CancelOutlined fontSize="small" />}
                            color="error"
                            onClick={() => setRemoveSupplierDialog(false)}
                        >
                            Close
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default DeletedContent;