import { Card, CardContent, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const TableComponent = ({ columns, rows, loadingTable }) => {
    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ mt: 2 }}>
            <Grid item lg={12} xl={12}>
                <Card raised sx={{ width: '100%' }}>
                    <CardContent>
                        <DataGrid rows={rows} columns={columns} loading={loadingTable} autoHeight />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
export default TableComponent;