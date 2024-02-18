import { AddLocationAltOutlined } from "@mui/icons-material";
import { Button, Card, CardContent, Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";

function ItemDelivery() {
    const columns = [
        { field: 'po_number', headerName: 'PO Number', flex: 1 },
        { field: 'batch_id', headerName: 'Batch Number', flex: 1 },
        { field: 'product_id', headerName: 'Product Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 1 },
        { field: 'price', headerName: 'Product Price', flex: 1 },
        { field: 'delivery_location', headerName: 'Delivery Location', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1 }
    ];
    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState({});

    return (
        <Grid container direction="row" justifyContent="flex-start" sx={{ px: 2, mt: 5 }}>
            <Dialog>
                <DialogTitle>Add New Item Delivery</DialogTitle>
                <DialogContent>
                    <Grid container></Grid>
                </DialogContent>
            </Dialog>
            <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }}>
                <Grid item>
                    <Button variant="contained" color="primary" endIcon={<AddLocationAltOutlined fontSize="small" />}>Add New Item Delivery</Button>
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Grid item lg={12} xl={12}>
                    <Card raised sx={{ width: '100%' }}>
                        <CardContent>
                            <DataGrid columns={columns} rows={rows} autoHeight />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ItemDelivery;