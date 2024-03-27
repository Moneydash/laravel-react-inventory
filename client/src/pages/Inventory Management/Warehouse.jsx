import { DomainAddOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { PrimaryColorBtn } from "components/elements/ButtonsComponent";
import TableComponent from "components/elements/TableComponent";
import ToastCmp from "components/elements/ToastComponent";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { decryptAccessToken } from "utils/auth";
import { inventoryCrumbs } from "utils/breadCrumbs";
import { axios_get_header } from "utils/requests";
import { get_warehouse_types } from 'utils/services';

function Warehouse() {
    document.title = 'Inventory IQ: Warehouse Management';
    const decrypt_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const columns = [
        { field: 'name', headerName: 'Warehouse Name', flex: 1 },
        { field: 'type', headerName: 'Warehouse Type', flex: 1 },
        { field: 'contact_person', headerName: 'Contact Person', flex: 1 },
        { field: 'person_conno', headerName: 'Mobile Number', flex: 1 },
        { field: 'email', headerName: 'Warehouse Email', flex: 1 },
        { field: 'hotline', headerName: 'Hotline', flex: 1 },
        { field: 'location', headerName: 'Location', flex: 1 },
        { field: 'landmark', headerName: 'Landmark', flex: 1 },
        { field: 'description', headerName: 'Description', flex: 1 },
        { field: 'id', headerName: 'Action', flex: 1 }
    ];
    const [rows, setRows] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [warehouseTypes, setWarehouseTypes] = useState([]);

    const getWarehouseTypes = async () => {
        axios_get_header(get_warehouse_types, decrypt_access_token)
        .then(response => {
            setWarehouseTypes(response.data.types);
        }).catch(error => {
            console.error(error);
            toast.error(try_again);
        });
    }

    const handleDialog = (open) => {
        setDialog(open);
        if (open === false) {
            console.log('false');
        } else {
            getWarehouseTypes();
        }
    }

    return(
        <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{ px: 2, mt: 3 }} display="flex">
            <ToastCmp />
            <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="lg">
                <DialogTitle>
                    New Warehouse
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 1.5, mt: -1 }}>Primary Information</Typography>
                    <Grid container direction="row" columnSpacing={{ lg: 2, xl: 2, sm: 2 }} rowSpacing={2}>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Warehouse Name *"
                                placeholder="Name of the Warehouse (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Warehouse Size *"
                                placeholder="Size of the Warehouse (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="warehouse_type_id" size="small">Warehouse Type *</InputLabel>
                                <Select
                                    labelId="warehouse_type_id"
                                    id="warehouse_type_id"
                                    label="Warehouse Type *"
                                    size="small"
                                >
                                    {warehouseTypes.map(warehouseType => (
                                        <MenuItem key={warehouseType.id} value={warehouseType.id}>
                                            { warehouseType.name }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Warehouse Location *"
                                placeholder="Location of Warehouse (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Warehouse Landmark *"
                                placeholder="Landmark of Warehouse (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Point of Contact *"
                                placeholder="Contact Person (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Mobile Number *"
                                placeholder="Point of Contact Mobile (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Description *"
                                placeholder="Description of Warehouse (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item lg={3} xl={3} sm={6} xs={12}>
                            <TextField
                                variant="outlined"
                                label="Description *"
                                placeholder="Description of Warehouse (Required)"
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={ inventoryCrumbs('Warehouse') } />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <PrimaryColorBtn endIcon={<DomainAddOutlined fontSize="small" />} displayText="Add New Warehouse" onClick={() => handleDialog(true)} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <TableComponent columns={columns} rows={rows} loadingTable={loadingTable} />
        </Grid>
    );
}

export default Warehouse;