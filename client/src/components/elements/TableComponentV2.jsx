import { Card, CardContent, Grid, Pagination, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector } from "@mui/x-data-grid";
import React from "react";
import PropTypes from "prop-types";
import { SelectCmp } from "./FieldComponents";

const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
};

const TableComponentV2 = ({
    columns,
    rows,
    loadingTable,
    size,
    handleSizeChange,
    page,
    handlePageChange,
    search,
    handleSearch,
    total,
    sx
}) => {
    const sizes = [
        { id: 10, name: '10' },
        { id: 25, name: '25' },
        { id: 50, name: '50' },
        { id: 100, name: '100' }
    ];

    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ mt: .2, ...sx }} rowSpacing={2}>
            <Grid item lg={12} xl={12}>
                <Card raised sx={{ width: '100%' }}>
                    <CardContent>
                        <Grid container justifyContent="flex-start" alignItems="center" sx={{ mb: 2 }}>
                            <Grid item lg={3} xl={3} sm={6} xs={12}>
                                <TextField
                                    label="Search"
                                    value={search}
                                    onChange={handleSearch}
                                    fullWidth
                                    placeholder="Search ..."
                                    size="small"
                                />
                            </Grid>
                        </Grid>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            loading={loadingTable}
                            autoHeight
                            disableRowSelectionOnClick
                            hideFooter
                            sx={{ mb: 2 }}
                            slots={{
                                toolbar: CustomToolbar
                            }}
                        />
                        {rows.length > 0 && (
                            <Grid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Grid item>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item>
                                            <Typography variant="body1">Rows per Page:</Typography>
                                        </Grid>
                                        <Grid item>
                                            <SelectCmp
                                                id="rows-per-page"
                                                value={size}
                                                onChange={handleSizeChange}
                                                items={sizes}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Pagination
                                        variant="outlined"
                                        shape="rounded"
                                        color="primary"
                                        page={page}
                                        onChange={handlePageChange}
                                        count={total}
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

TableComponentV2.defaultProps = {
    columns: [],
    rows: [],
    loadingTable: false,
    size: 10,
    handleSizeChange: () => {},
    page: 1,
    handlePageChange: () => {},
    search: '',
    handleSearch: () => {},
    total: 1,
    sx: {}
};

TableComponentV2.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    loadingTable: PropTypes.bool,
    size: PropTypes.number,
    handleSizeChange: PropTypes.func,
    page: PropTypes.number,
    handlePageChange: PropTypes.func,
    search: PropTypes.string,
    handleSearch: PropTypes.func,
    total: PropTypes.number,
    sx: PropTypes.object
}

export default TableComponentV2;