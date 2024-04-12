import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { AddBoxOutlined, CancelOutlined, DeleteOutlineRounded, DeleteRounded, EditRounded, GroupAddOutlined, GroupRemoveOutlined, InsertDriveFileOutlined, RefreshOutlined, RestoreOutlined } from "@mui/icons-material";
import * as EmailValidator from 'email-validator';
import { axios_delete_header, axios_get_header, axios_post_header_file, axios_put_header } from "utils/requests";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { inventoryCrumbs } from "utils/breadCrumbs";
import ToastCmp from "components/elements/ToastComponent";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import FileUploadCmp from "components/elements/FileUploadComponent";
import TableComponent from "components/elements/TableComponent";
import { decryptAccessToken } from "utils/auth";
import {
    get_Suppliers,
    get_Removed_suppliers,
    get_Supplier,
    restore_Supplier,
    update_Supplier,
    add_Supplier
} from 'utils/services';
import { DatePickerCmp } from "components/elements/FieldComponents";

function Supplier() {
    document.title = "InventoryIQ: Supplier Partners";
    const decrypted_access_token = decryptAccessToken();
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

    const renderRestoreBtns = (params) => {
        return <div>
                <Tooltip title="Restore Supplier" placement="bottom" arrow>
                    <Button variant="contained" size="small" onClick={() => restore_deleted(params.value)} color="primary" endIcon={<RestoreOutlined fontSize="small"/>}>
                        Restore
                    </Button>
                </Tooltip>
            </div>
    }

    // table columns
    const columns = [
        { field: 'name', headerName: 'Supplier Name', flex: 1 },
        { field: 'location', headerName: 'Supplier Location', flex: 1 },
        { field: 'email', headerName: 'Supplier Email', flex: 1 },
        { field: 'hotline', headerName: 'Supplier Hotline', flex: 1 },
        { field: 'contact_person', headerName: 'Contact Person', flex: 1 },
        { field: 'contact_person_number', headerName: 'Contact Person #', flex: 1 },
        { field: 'contract_expiry_date', headerName: 'Contract Expiry Date', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons },
    ];

    // columns for removed suppliers
    const remove_columns = [
        { field: 'name', headerName: 'Supplier Name', flex: 1 },
        { field: 'email', headerName: 'Supplier Email', flex: 1 },
        { field: 'supp_status', headerName: 'Status', flex: 1 },
        { field: 'id', headerName: 'Restore', flex: 1, renderCell: renderRestoreBtns }
    ];

    const [rows, setRows] = useState([]); // initialized empty rows
    const [removerows, setRemoveRows] = useState([]); // initialized empty rows for removed suppliers
    const [dialog, setDialog] = useState(false);
    const [removeDialog, setRemoveDialog] = useState(false);
    const [removeSupplierDialog, setRemoveSupplierDialog] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(0);
    // initial data
    const initialFormData = {
        id: '',
        name: '',
        location: '',
        email: '',
        hotline: '',
        contact_person: '',
        contact_person_number: '',
        contract_expiry_date: dayjs(),
        terms: '',
        terms_name: '',
        agreement: '',

    };
    const initialError = {
        name: false,
        location: false,
        email: false,
        hotline: false,
        contact_person: false,
        contact_person_number: false,
        contract_expiry_date: false,
        terms_name: false,
        agreement_name: false
    };
    const initialTextHelper = {
        name: '',
        location: '',
        email: '',
        hotline: '',
        contact_person: '',
        contact_person_number: '',
        contract_expiry_date: '',
        terms_name: '',
        agreement_name: ''
    };

    // forms
    const [formData, setFormData] = useState(initialFormData);
    const [formDataError, setFormDataError] = useState(initialError);
    const [formDataHelperText, setFormDataHelperText] = useState(initialTextHelper);
    
    // get suppliers list
    const get_suppliers = () => {
        setRows([]);
        setLoadingTable(true);
        axios_get_header(get_Suppliers, decrypted_access_token)
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
                
                return {
                    id: item["id"],
                    name: item["name"],
                    location: item["location"],
                    email: item["email"],
                    hotline: item["hotline"],
                    contact_person: item['contact_person'],
                    contact_person_number: item['contact_person_number'],
                    contract_expiry_date: formattedDate
                }
            });
            setRows(transformedData);
        })
        .catch(error => { setLoadingTable(false); console.log(error); });
    }

    // get the list of all removed suppliers
    const get_removed_suppliers = () => {
        axios_get_header(get_Removed_suppliers, decrypted_access_token)
        .then(response => {
            const transformedData = response.data.removed_suppliers.map(item => {
                const supp_status = item['deleted_at'] === null ? 'Active' : 'Deleted';

                return {
                    id: item['id'],
                    name: item['name'],
                    email: item['email'],
                    supp_status: supp_status
                }
            });
            setRemoveSupplierDialog(true);
            setRemoveRows(transformedData);
        })
        .catch(error => { console.log(error); });
    }

    // get specific supplier for updates
    const get_supplier = async (param) => {
        await axios_get_header(get_Supplier + param, decrypted_access_token)
        .then(response => {
            const data = response.data.supplier_info;
            const terms_file = data.terms_and_conditions.split("/").pop();
            const agreement_file = data.agreement.split("/").pop();
            setFormData((prevState) => ({
                ...prevState,
                id: data.id,
                name: data.name,
                location: data.location,
                email: data.email,
                hotline: data.hotline,
                contact_person: data.contact_person,
                contact_person_number: data.contact_person_number,
                contract_expiry_date: dayjs(data.contract_expiry_date),
                terms_name: terms_file,
                agreement_name: agreement_file
            }));
            setEditIndex(1);
            handleDialog(true);
        }).catch(error => { console.log(error); });
    };

    const restore_deleted = async (params) => {
        await axios_put_header(`${restore_Supplier}${params}`, {}, decrypted_access_token)
        .then(response => {
            toast.success(response.data.message);
            get_removed_suppliers();
            get_suppliers();
        }).catch(error => {
            console.log(error);
            toast.error('Oops, something went wrong. Please try again later.');
        });
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

    // for changing inputs
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        // email validation
        if(name === 'email') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
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
        if (name === 'name' || name === 'location' || name === 'hotline' || name === 'contact_person') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
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
            setFormData((prevState) => ({ ...prevState, [name]: value }));
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

        if (name === 'terms' || name === 'agreement') {
            const file = files[0];

            if (file) {
                const filereader = new FileReader();
                filereader.readAsDataURL(file);
                if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
                    if (file.size <= parseInt((5 * 1024) * 1024)) {
                        filereader.onloadend = function(e) {
                            setFormData((prevState) => ({ ...prevState, [name]: file, [`${name}_name`]: file.name }));
                            setFormDataError((prevError) => ({ ...prevError, [`${name}_name`]: false }));
                            setFormDataHelperText((prevText) => ({ ...prevText, [`${name}_name`]: '' }));
                        }
                    } else {
                        setFormData((prevState) => ({ ...prevState, [name]: '', [`${name}_name`]: '' }));
                        setFormDataError((prevError) => ({ ...prevError, [`${name}_name`]: true }));
                        setFormDataHelperText((prevText) => ({ ...prevText, [`${name}_name`]: 'File size limit is 5MB, please select another file.' }));
                        toast.error('File size limit is 5MB');
                    }
                } else {
                    setFormData((prevState) => ({ ...prevState, [name]: '', [`${name}_name`]: '' }));
                    setFormDataError((prevError) => ({ ...prevError, [`${name}_name`]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [`${name}_name`]: 'Please select a valid file (pdf, doc, docx)' }));
                    toast.error('.pdf, .doc and .docx file are only allowed');
                }
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
        setFormData((prevState) => (initialFormData));
        setFormDataError((prevError) => (initialError));
        setFormDataHelperText((prevText) => (initialTextHelper));
        get_suppliers();
    }

    const handleDialog = (open) => {
        setDialog(open);
        if (!open) {
            formDataReset();
            setEditIndex(0);
        }
    }

    const createFormData = (data) => {
        if (typeof data === 'object') {
            const createdFormData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                createdFormData.append(key, value);
            });
            return createdFormData;
        } else {
            console.error('Data is not an object');
            return null;
        }
    }

    // supplier creation or updates
    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;

        setLoading(true);

        for (const field in formData) {
            if (formDataError[field] === true || formData[field] === '') {
                if (editIndex !== 1 && (field === 'terms' || field === 'agreement')) {
                    hasError = true;
                } else {
                    hasError = false;
                }
            }
        }

        const formattedDate = dayjs(formData.contract_expiry_date).format('YYYY-MM-DD');
        const transformData = {
            name: formData.name,
            location: formData.location,
            email: formData.email,
            hotline: formData.hotline,
            contact_person: formData.contact_person,
            contact_person_number: formData.contact_person_number,
            contract_expiry_date: formattedDate,
            terms: formData.terms,
            agreement: formData.agreement
        };

        const formDataSubmit = createFormData(transformData);

        if (hasError) {
            setLoading(false);
            toast.error('Check for empty and error fields!');
        } else {
            if (editIndex === 1) {
                axios_post_header_file(update_Supplier + formData.id, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    toast.success(response.data.message);
                    formDataReset();
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error);
                });
            } else {
                axios_post_header_file(add_Supplier, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    toast.success(response.data.message);
                })
                .catch(error => { setLoading(false); console.log(error); });
            }
        }
    }

    const handleRemove = (e) => {
        e.preventDefault();
        
        setLoading(true);
        axios_delete_header('/supplier/remove_supplier/' + formData.id, {}, decrypted_access_token)
        .then(response => {
            setLoading(false);
            setRemoveDialog(false);
            formDataReset();
            toast.success(response.data.message);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        });
    }

    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 3 }} display="flex">
            <ToastCmp />
            
            {/* edit and add dialog */}
            <Dialog open={dialog} fullWidth maxWidth="sm">
                <DialogTitle>{editIndex === 1 ? "Update Supplier Information" : "Add Supplier Partner"}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container direction="column" rowSpacing={2}>
                        <Grid item>
                            <TextField variant="outlined" placeholder="Name of Supplier" label="Supplier Name" name="name" value={formData.name} error={formDataError.name} helperText={formDataHelperText.name} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" placeholder="Location of Supplier" label="Supplier Location" name="location" value={formData.location} error={formDataError.location} helperText={formDataHelperText.location} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" placeholder="Email of Supplier" label="Supplier Email" name="email" value={formData.email} error={formDataError.email} type="email" helperText={formDataHelperText.email} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" placeholder="Hotline of Supplier" label="Supplier Hotline" name="hotline" value={formData.hotline} error={formDataError.hotline} type="number" helperText={formDataHelperText.hotline} onChange={handleChange} fullWidth/>
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" placeholder="Point of Contact" label="Contact Person" name="contact_person" value={formData.contact_person} onChange={handleChange} error={formDataError.contact_person} helperText={formDataHelperText.contact_person} fullWidth />
                        </Grid>
                        <Grid item>
                            <TextField variant="outlined" placeholder="Mobile Number of Contact Person" label="Contact Person Mobile Number" value={formData.contact_person_number} onChange={handleChange} name="contact_person_number" error={formDataError.contact_person_number} helperText={formDataHelperText.contact_person_number} fullWidth />
                        </Grid>
                        <Grid item lg={12} xl={12}>
                            <DatePickerCmp
                                onChange={handleDateChange}
                                label="Contract Expiry Date"
                                name="contract_expiry_date"
                                value={formData.contract_expiry_date}
                                helperText={formDataHelperText.contract_expiry_date}
                                error={formDataError.contract_expiry_date}
                            />
                        </Grid>
                        <Grid container mt={3} columnSpacing={{ lg: 2, xl: 2 }}>
                            <Grid item xl={6} lg={6}>
                                <FileUploadCmp
                                    name="terms"
                                    fileName="terms_name"
                                    fileNameError={formDataError.terms_name}
                                    fileNameHelperText={formDataHelperText.terms_name}
                                    placeholder="Terms and Conditions"
                                    fileNameValue={formData.terms_name}
                                    accept=".pdf, .docx, .doc"
                                    endIcon={<InsertDriveFileOutlined />}
                                    disabled={editIndex === 2}
                                    handleChange={handleChange}
                                />
                            </Grid>
                            <Grid item xl={6} lg={6} sm={6}>
                                <FileUploadCmp
                                    name="agreement"
                                    fileName="agreement_name"
                                    fileNameError={formDataError.agreement_name}
                                    fileNameHelperText={formDataHelperText.agreement_name}
                                    placeholder="Contract Agreement"
                                    fileNameValue={formData.agreement_name}
                                    accept=".pdf, .docx, .doc"
                                    endIcon={<InsertDriveFileOutlined />}
                                    disabled={editIndex === 2}
                                    handleChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" sx={{ mr: 2, mb: 1 }} columnSpacing={{ lg: 1, xl: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelOutlined fontSize="small"/>} onClick={() => handleDialog(false)}>Cancel</Button>
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
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={ inventoryCrumbs('Suppliers') } />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="end" display="flex">
                            <Button variant="contained" endIcon={<GroupRemoveOutlined fontSize="small" />} onClick={get_removed_suppliers}>Deleted Suppliers</Button>
                        </Grid>
                        <Grid item justifyContent="end" display="flex">
                            <Button variant="contained" onClick={get_suppliers} endIcon={<RefreshOutlined fontSize="small" />}>Refresh Table</Button>
                        </Grid>
                        <Grid item justifyContent="end" display="flex">
                            <Button variant="contained" onClick={() => handleDialog(true)} endIcon={<GroupAddOutlined fontSize="small" />}>Add Supplier Partner</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* table definitions */}
            <TableComponent columns={columns} rows={rows} loadingTable={loadingTable} />
        </Grid>
    );
}

export default Supplier;