import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { AddBoxOutlined, CancelOutlined, CancelRounded, CloseRounded, DeleteOutlineRounded, DeleteRounded, EditRounded, GroupAddOutlined, GroupRemoveOutlined, RefreshOutlined } from "@mui/icons-material";
import * as EmailValidator from 'email-validator';
import { axios_get_header, axios_patch_header, axios_post_header, axios_put_header } from "../request/apiRequests";
import { AES, enc } from "crypto-js";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function Supplier() {
    document.title = "InventoryIQ: Supplier Partners";
    const decrypted_access_token = AES.decrypt(localStorage.getItem('access_token'), process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8); // decrypt access token
    const empty_field_warning = 'Please fill up required field!';

    const renderActionButtons = (params) => {
        return <div>
                <IconButton onClick={() => get_supplier(params.value)} color="primary">
                    <Tooltip title="Update Supplier Partner" placement="bottom" arrow><EditRounded fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => remove_supplier(params.value)} color="error" sx={{ ml: 1 }}>
                    <Tooltip title="Remove Supplier Partner" placement="bottom" arrow><DeleteRounded fontSize="small"/></Tooltip>
                </IconButton>
        </div>
    }

    // table columns
    const columns = [
        { field: 'supp_name', headerName: 'Supplier Name', flex: 1 },
        { field: 'supp_loc', headerName: 'Supplier Location', flex: 1 },
        { field: 'supp_email', headerName: 'Supplier Email', flex: 1 },
        { field: 'supp_hotline', headerName: 'Supplier Hotline', flex: 1 },
        { field: 'contact_person', headerName: 'Contact Person', flex: 1 },
        { field: 'contact_person_number', headerName: 'Contact Person #', flex: 1 },
        { field: 'contract_expiry_date', headerName: 'Contract Expiry Date', flex: 1 },
        { field: 'supp_status', headerName: 'Supplier Status', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons },
    ];

    // columns for removed suppliers
    const remove_columns = [
        { field: 'supp_name', headerName: 'Supplier Name', flex: 1 },
        { field: 'supp_email', headerName: 'Supplier Email', flex: 1 },
        { field: 'supp_status', headerName: 'Status', flex: 1 }
    ];

    const [rows, setRows] = useState([]); // initialized empty rows
    const [removerows, setRemoveRows] = useState([]); // initialized empty rows for removed suppliers
    const [dialog, setDialog] = useState(false);
    const [removeDialog, setRemoveDialog] = useState(false);
    const [removeSupplierDialog, setRemoveSupplierDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [loadingTable, setLoadingTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(0);
    
    // forms
    const [formData, setFormData] = useState({
        id: '',
        supp_name: '',
        supp_loc: '',
        supp_email: '',
        supp_hotline: '',
        contact_person: '',
        contact_person_number: '',
        contract_expiry_date: dayjs(),
    });
    const [formDataError, setFormDataError] = useState({
        supp_name: false,
        supp_loc: false,
        supp_email: false,
        supp_hotline: false,
        contact_person: false,
        contact_person_number: false,
        contract_expiry_date: false
    });
    const [formDataHelperText, setFormDataHelperText] = useState({
        supp_name: '',
        supp_loc: '',
        supp_email: '',
        supp_hotline: '',
        contact_person: '',
        contact_person_number: '',
        contract_expiry_date: ''
    });
    
    // get suppliers list
    const get_suppliers = () => {
        setRows([]);
        setLoadingTable(true);
        axios_get_header('/supplier/get_suppliers', decrypted_access_token)
        .then(response => {
            setLoadingTable(false);
            const transformedData = response.data.suppliers.map(item => {
                const date = new Date(item["contract_expiry_date"]);
                // Extract the date components
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
                const day = date.getDate().toString().padStart(2, '0');

                // Create the formatted date string in "yyyy-mm-dd HH:mm:ss" format
                const formattedDate = `${month}/${day}/${year}`;
                const supp_status = item['supp_status'] === true ? 'Active' : 'Deleted';
                
                return {
                    id: item["id"],
                    supp_name: item["supp_name"],
                    supp_loc: item["supp_loc"],
                    supp_email: item["supp_email"],
                    supp_hotline: item["supp_hotline"],
                    contact_person: item['contact_person'],
                    contact_person_number: item['contact_person_number'],
                    contract_expiry_date: formattedDate,
                    supp_status: supp_status,
                }
            });
            setRows(transformedData);
        })
        .catch(error => { setLoadingTable(false); console.log(error); });
    }

    // get the list of all removed suppliers
    const get_removed_suppliers = () => {
        axios_get_header('/supplier/get_removed_suppliers', decrypted_access_token)
        .then(response => {
            const transformedData = response.data.removed_suppliers.map(item => {
                const supp_status = item['supp_status'] === false ? 'Deleted' : 'Active';

                return {
                    id: item['id'],
                    supp_name: item['supp_name'],
                    supp_email: item['supp_email'],
                    supp_status: supp_status
                }
            });
            setRemoveSupplierDialog(true);
            setRemoveRows(transformedData);
        })
        .catch(error => { console.log(error); });
    }

    // get specific supplier for updates
    const get_supplier = (param) => {
        axios_get_header('/supplier/get_supplier/' + param, decrypted_access_token)
        .then(response => {
            const data = response.data.supplier_info;
            setFormData((prevState) => ({
                ...prevState,
                id: data.id,
                supp_name: data.supp_name,
                supp_loc: data.supp_loc,
                supp_email: data.supp_email,
                supp_hotline: data.supp_hotline,
                contact_person: data.contact_person,
                contact_person_number: data.contact_person_number,
                contract_expiry_date: dayjs(data.contract_expiry_date)
            }));
            setEditIndex(1);
            setDialog(true);
        }).catch(error => { console.log(error); });
    }

    // get specific supplier for removal
    const remove_supplier = (param) => {
        setFormData((prevState) => ({ ...prevState, id: param }));
        setRemoveDialog(true);
    }

    /* eslint-disable */
    useEffect(() => {
        get_suppliers();
    }, []);
    /* eslint-disable */

    // handle the snackbar show up and message
    const handleSnackbar = (status, message) => { setSnackbar((prevSnack) => ({ ...prevSnack, open: status, message: message })) }
    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="cancel"
                color="inherit"
                onClick={() => handleSnackbar(false, '')}
            >
                <CloseRounded fontSize="small" />
            </IconButton>
        </Fragment>
    );

    // for changing inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
        
        // email validation
        if(name === 'supp_email') {
            if (!EmailValidator.validate(value)) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please enter a valid email address.' }));
            } else if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        // basic input validation
        if (name === 'supp_name' || name === 'supp_loc' || name === 'supp_hotline' || name === 'contact_person') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        // ph mobile number validation
        if (name === 'contact_person_number') {
            const ph_mobile_regex = /^(09|\+639)\d{9}$/;
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else if (!ph_mobile_regex.test(value)) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please enter a valid Philippine mobile number. It should start with \'09\' or \'+639\' followed by 9 digits.' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }
    }

    const handleDateChange = (date) => {
        const formattedDate = date ? dayjs(date) : '';

        setFormData((prevState) => ({ ...prevState, contract_expiry_date: formattedDate }));

        if (!formattedDate) {
            setFormDataError((prevError) => ({ ...prevError, contract_expiry_date: true }));
            setFormDataHelperText((prevText) => ({ ...prevText, contract_expiry_date: empty_field_warning }));
        } else {
            setFormDataError((prevError) => ({ ...prevError, contract_expiry_date: false }));
            setFormDataHelperText((prevText) => ({ ...prevText, contract_expiry_date: '' }));
        }
    }

    // reset all fields on the form
    const formDataReset = () =>  {
        setFormData((prevState) => ({
            ...prevState,
            id: '',
            supp_name: '',
            supp_loc: '',
            supp_email: '',
            supp_hotline: '',
            contact_person: '',
            contact_person_number: '',
            contract_expiry_date: dayjs()
        }));
        get_suppliers();
    }

    const handleDialog = () => {
        setDialog(false);
        formDataReset();
        setEditIndex(0);
    }

    // supplier creation or updates
    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;

        setLoading(true);

        for (const field in formDataError) {
            if (formDataError[field] === true) {
                hasError = true;
            }
        }

        const formattedDate = dayjs(formData.contract_expiry_date).format('YYYY-MM-DD');
        const formDataSubmit = {
            supp_name: formData.supp_name,
            supp_loc: formData.supp_loc,
            supp_email: formData.supp_email,
            supp_hotline: formData.supp_hotline,
            contact_person: formData.contact_person,
            contact_person_number: formData.contact_person_number,
            contract_expiry_date: formattedDate
        };

        if (hasError) {
            setLoading(false);
            handleSnackbar(true, 'Check for empty and error fields!');
        } else {
            if (editIndex === 1) {
                axios_put_header('/supplier/update_supplier/' + formData.id, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    setDialog(false);
                    handleSnackbar(true, response.data.message);
                    formDataReset();
                    get_suppliers();
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error);
                });
            } else {
                axios_post_header('/supplier/add_supplier', formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    setDialog(false);
                    handleSnackbar(true, response.data.message);
                    formDataReset();
                    get_suppliers();
                })
                .catch(error => { setLoading(false); console.log(error); });
            }
        }
    }

    const handleRemove = (e) => {
        e.preventDefault();
        
        setLoading(true);
        axios_patch_header('/supplier/remove_supplier/' + formData.id, {}, decrypted_access_token)
        .then(response => {
            setLoading(false);
            setRemoveDialog(false);
            formDataReset();
            handleSnackbar(true, response.data.message);
            get_suppliers();
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        });
    }

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 5 }}>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => handleSnackbar(false, '')} message={snackbar.message} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} action={action} />
            
            {/* edit and add dialog */}
            <Dialog onClose={() => setDialog(false)} open={dialog} fullWidth maxWidth="md">
                <DialogTitle>Add Supplier Partner</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container direction="column" rowSpacing={2}>
                        <Grid item>
                            <TextField variant="outlined" label="Supplier Name" name="supp_name" value={formData.supp_name} error={formDataError.supp_name} helperText={formDataHelperText.supp_name} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" label="Supplier Location" name="supp_loc" value={formData.supp_loc} error={formDataError.supp_loc} helperText={formDataHelperText.supp_loc} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" label="Supplier Email" name="supp_email" value={formData.supp_email} error={formDataError.supp_email} type="email" helperText={formDataHelperText.supp_email} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" label="Supplier Hotline" name="supp_hotline" value={formData.supp_hotline} error={formDataError.supp_hotline} type="number" helperText={formDataHelperText.supp_hotline} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" label="Contact Person" name="contact_person" value={formData.contact_person} onChange={handleChange} error={formDataError.contact_person} helperText={formDataHelperText.contact_person} fullWidth />
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" label="Contact Person Mobile Number" value={formData.contact_person_number} onChange={handleChange} name="contact_person_number" error={formDataError.contact_person_number} helperText={formDataHelperText.contact_person_number} fullWidth />
                        </Grid>
                        <Grid item lg={12} xl={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Contract Expiry Date" onChange={handleDateChange} name="contract_expiry_date" value={formData.contract_expiry_date} sx={{ width: '100%' }} minDate={dayjs()} slotProps={{ textField: { helperText: formDataHelperText.contract_expiry_date, error: formDataError.contract_expiry_date } }} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" sx={{ mr: 2, mb: 1 }} columnSpacing={{ lg: 1, xl: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelRounded fontSize="small"/>} onClick={handleDialog}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            {loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>{ editIndex === 1 ? 'Updating Supplier' : 'Adding Supplier' }</LoadingButton> : <Button variant="contained" endIcon={editIndex === 1 ? <EditRounded fontSize="small"/> : <AddBoxOutlined fontSize="small"/>} onClick={handleSubmit}>{ editIndex === 1 ? 'Update Supplier' : 'Add Supplier' }</Button>}
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* remove dialog */}
            <Dialog open={removeDialog} onClose={() => setRemoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Remove Supplier Partner</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">The supplier partner will be removed, are you sure about this?</Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" sx={{ mr: 2, mb: 1 }} columnSpacing={{ lg: 1, xl: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="primary" endIcon={<CancelOutlined />} onClick={() => setRemoveDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            {loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Removing Supplier Partner</LoadingButton> : <Button variant="contained" color="error" endIcon={<DeleteOutlineRounded />} onClick={handleRemove}>Remove Supplier Partner</Button>}
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* dialog list for deleted suppliers */}
            <Dialog open={removeSupplierDialog} onClose={() => setRemoveSupplierDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>List of Deleted Suppliers</DialogTitle>
                <Divider />
                <DialogContent>
                    <DataGrid rows={removerows} columns={remove_columns} autoHeight />
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <Button variant="contained" endIcon={<CancelOutlined fontSize="small" />} color="error" onClick={() => setRemoveSupplierDialog(false)}>Close</Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* table buttons */}
            <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: .3 }}>
                <Grid item>
                    <Button variant="contained" endIcon={<GroupRemoveOutlined fontSize="small" />} onClick={get_removed_suppliers}>Deleted Suppliers</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={get_suppliers} endIcon={<RefreshOutlined fontSize="small" />}>Refresh Table</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => setDialog(true)} endIcon={<GroupAddOutlined fontSize="small" />}>Add Supplier Partner</Button>
                </Grid>
            </Grid>

            {/* table definitions */}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ mt: 2 }}>
                <Grid item lg={12} xl={12}>
                    <Card raised sx={{ width: '100%', mr: 2 }}>
                        <CardContent>
                            <DataGrid rows={rows} columns={columns} loading={loadingTable} autoHeight/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Supplier;