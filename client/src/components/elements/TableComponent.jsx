import { Card, CardContent, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import PropTypes from "prop-types";

const TableComponent = ({ columns, rows, loadingTable, sx }) => {
    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ mt: 2, ...sx }}>
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

TableComponent.defaultProps = {
    columns: [],
    rows: [],
    loadingTable: false,
    sx: {}
};

TableComponent.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    loadingTable: PropTypes.bool,
    sx: PropTypes.object
}

export default TableComponent;