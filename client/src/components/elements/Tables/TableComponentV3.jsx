import { Card, CardContent, Grid, Pagination, TextField, Typography } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { SelectCmp } from "../FieldComponents";
import useDebounce from "hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemsRequest } from "store/actions";
import { makeSelectRowsEntity } from "utils/helper";

const CustomToolbar = () => {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
        </GridToolbarContainer>
    );
};

const TableComponentV3 = ({
    columns,
    url,
    entity,
    sx
}) => {
    const selectRowsForEntity = makeSelectRowsEntity();
    // track pagination, loading and rows
    const rows = useSelector((state) => selectRowsForEntity(state, entity));
    const loading = useSelector((state) => state.itemReducer.loading || false);
    const total = useSelector((state) => state.itemReducer.totalPages);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 300);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchItemsRequest(`${url}?page=${currentPage}&per_page=${rowsPerPage}&search=${debounceSearch}`, entity));
    }, [currentPage, rowsPerPage, debounceSearch, entity, url, dispatch]);

    const perPages = [
        { id: 10, name: '10' },
        { id: 25, name: '25' },
        { id: 50, name: '50' },
        { id: 100, name: '100' }
    ];

    /* table actions --- start */
    const handleSearch = (e) => {
        const { value } = e.target;
        setSearch(value);
        setCurrentPage(1);
    }

    const handlePageChange = (e, newPage) => {
        setCurrentPage(Number(newPage));
    };

    const handleSizeChange = (e) => {
        const { value } = e.target;
        setRowsPerPage(value);
        setCurrentPage(1);
    }
    /* table actions --- end */

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
                            loading={loading}
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
                                                value={rowsPerPage}
                                                onChange={handleSizeChange}
                                                items={perPages}
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
                                        page={currentPage}
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

TableComponentV3.defaultProps = {
    columns: [],
    url: '',
    entity: '',
    sx: {}
};

TableComponentV3.propTypes = {
    columns: PropTypes.array,
    url: PropTypes.string,
    entity: PropTypes.string,
    sx: PropTypes.object
}

export default TableComponentV3;