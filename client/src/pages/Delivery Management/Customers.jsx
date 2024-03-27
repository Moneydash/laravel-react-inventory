import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { AttachmentOutlined, CancelOutlined, CloseRounded, DeleteRounded, EditOutlined, EditRounded, GroupAddOutlined, InfoOutlined, PaymentRounded, PersonAddAltOutlined, PersonRemoveAlt1Outlined, RefreshOutlined } from '@mui/icons-material';
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import React, { Fragment, useEffect, useState } from "react";
import { validate } from "email-validator";
import { axios_get_header, axios_patch_header, axios_post_header_file } from "../../utils/requests";
import { decryptAccessToken } from 'utils/auth';
import {
    get_Customers,
    get_Customer,
    get_Customer_payment,
    update_Customer,
    add_Customer
} from 'utils/services';

function Customers() {
    document.title = 'InventoryIQ: Delivery Hub - Customers';
    const decrypted_access_token = decryptAccessToken();
    const empty_field_warning = 'Please fill up required field!';

    const renderActionButtons = (params) => {
        return <div>
            <IconButton onClick={() => get_customer(2, params.value)} color="primary">
                <Tooltip title="View Customer Information" placement="bottom" arrow><InfoOutlined fontSize="small"/></Tooltip>
            </IconButton>
            <IconButton onClick={() => get_customer(1, params.value)} color="primary" sx={{ ml: 1 }}>
                <Tooltip title="Update Customer Information" placement="bottom" arrow><EditRounded fontSize="small"/></Tooltip>
            </IconButton>
            <IconButton onClick={() => get_customer_payment(params.value)} color="primary" sx={{ ml: 1 }}>
                <Tooltip title="Make A Payment" placement="bottom" arrow><PaymentRounded fontSize="small"/></Tooltip>
            </IconButton>
            <IconButton onClick={() => get_customer(3, params.value)} color="error" sx={{ ml: 1 }}>
                <Tooltip title="Remove Customer" placement="bottom" arrow><DeleteRounded fontSize="small"/></Tooltip>
            </IconButton>
        </div>
    };

    const columns = [
        { field: 'firstname', headerName: 'First Name', flex: 1 },
        { field: 'lastname', headerName: 'Last Name', flex: 1 },
        { field: 'contact_number', headerName: 'Contact Number', flex: 1 },
        { field: 'email', headerName: 'E-mail Address', flex: 1 },
        { field: 'location', headerName: 'Customer Location', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];

    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [removeDialog, setRemoveDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [editIndex, setEditIndex] = useState(0); // 0 = create, 1 = update, 2 = view, 3 = remove or disable
    const initialFormData = {
        id: '',
        customer_img: '',
        firstname: '',
        middlename: '',
        lastname: '',
        contact_number: '',
        email: '',
        customer_payment_status: 0,
        customer_latest_payment_amnt: '',
        customer_credit_amnt: '',
        customer_location: ''
    };
    const initialFormDataError = {
        customer_img: false,
        firstname: false,
        lastname: false,
        contact_number: false,
        email: false,
        customer_payment_status: false,
        customer_payment_amnt: false,
        customer_location: false
    };
    const initialFormDataHelperText = {
        customer_img: '',
        firstname: '',
        lastname: '',
        contact_number: '',
        email: '',
        customer_payment_status: 0,
        customer_payment_amnt: '',
        customer_location: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [formDataError, setFormDataError] = useState(initialFormDataError);
    const [formDataHelperText, setFormDataHelperText] = useState(initialFormDataHelperText);

    const get_customers = () => {
        setTableLoading(true);
        axios_get_header(get_Customers, decrypted_access_token)
        .then(response => {
            const transformedData = response.data.customers.map(customer => {
                return {
                    id: customer['id'],
                    firstname: customer['firstname'],
                    lastname: customer['lastname'],
                    contact_number: customer['contact_number'],
                    email: customer['email'],
                    location: customer['customer_location']
                };
            });
            setTableLoading(false);
            setRows(transformedData);
        })
        .catch(error => {
            setTableLoading(false);
            handleSnackbar(true, 'Oops, something went wrong. Please try again later.');
            console.log(error);
        });
    };

    /* eslint-disable */
    useEffect(() => {
        get_customers();
    }, []);
    /* eslint-disable */

    const refresh_table = () => {
        setRows([]);
        get_customers();
    };
    
    const get_customer = (editIndexValue, customer_id) => {
        setEditIndex(editIndexValue);
        axios_get_header(get_Customer + customer_id, decrypted_access_token)
        .then(response => {
            const data = response.data.customer_data;
            const cleanedPath = data.customer_img.substring(data.customer_img.indexOf('/') + 1);
            setImgSrc(process.env.REACT_APP_API_BASE_IMG_URL + cleanedPath);
            setFormData((prevState) => ({
                ...prevState,
                id: data.id,
                firstname: data.firstname,
                middlename: data.middlename === null ? '' : data.middlename,
                lastname: data.lastname,
                contact_number: data.contact_number,
                email: data.email,
                customer_location: data.customer_location
            }));
            if (editIndexValue === 3) {
                handleRemoveDialog(true);
            } else {
                handleDialog(true);
            }
        })
    };

    const get_customer_payment = (customer_id) => {
        axios_get_header(get_Customer_payment + customer_id, decrypted_access_token)
        .then(response => {
            const data = response.data;
            console.log(data);
            if (data.credit_standing !== null) {
                setFormData((prevState) => ({
                    ...prevState,
                    customer_payment_status: data.customer_payment_status,
                    customer_credit_amnt: data.customer_credit_amnt
                }));
                handlePaymentDialog(true);
            } else {
                handleSnackbar(true, 'No outstanding payments for this customer.');
            }
        })
    }

    const formDataReset = () => {
        setFormData(initialFormData);
        setFormDataError(initialFormDataError);
        setFormDataHelperText(initialFormDataHelperText);
        setImgSrc('');
    };

    const handleDialog = (open) => {
        setDialog(open);
        if (open === false) {
            setEditIndex(0);
            formDataReset();
        }
    };

    const handlePaymentDialog = (open) => {
        setPaymentDialog(open);
        if (open === false) {
            formDataReset();
        }
    };

    const handleRemoveDialog = (open) => {
        setRemoveDialog(open);
        if (open === false) {
            formDataReset();
        }
    }

    const handleSnackbar = (open, message) => { setSnackbar((prevSnack) => ({ ...prevSnack, open: open, message: message })) }
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        /* form validation starts here */

        // customer profile image
        if (name === 'customer_img') {
            const file = files[0];

            var filereader = new FileReader();
            filereader.readAsDataURL(file);
            if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
                if (file.size <= parseInt((5 * 1024) * 1024)) {
                    filereader.onloadend = function(e) {
                        setImgSrc(filereader.result);
                        setFormData((prevState) => ({ ...prevState, [name]: file }));
                        setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                        setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
                    }
                } else {
                    setImgSrc('');
                    setFormData((prevState) => ({ ...prevState, [name]: '' }));
                    setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'File size limit is 5MB, please select another file.' }));
                }
            } else {
                setImgSrc('');
                setFormData((prevState) => ({ ...prevState, [name]: '' }));
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please select a valid image file (png, jpeg, jpg or gif)' }));
            }
        }

        // customer first name
        if (name === 'firstname') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else if (value.length < 2) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please enter a valid first name with at least 2 characters.' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }
        
        // customer middlename
        if (name === 'middlename') { setFormData((prevState) => ({ ...prevState, [name]: value })); }

        // customer lastname
        if (name === 'lastname') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else if (value.length < 2) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please enter a valid last name with at least 2 characters.' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        // customer contact number / mobile number
        if (name === 'contact_number') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
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

        // customer email address
        if (name === 'email') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else if (!validate(value)) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please enter a valid email address.' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        // customer payment status
        if (name === 'customer_payment_status') { setFormData((prevState) => ({ ...prevState, [name]: value })); }

        // customer payment amount
        if (name === 'customer_payment_amnt') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            
            // Use a regular expression to check for a valid real number
            const isValidNumber = /^[1-9]\d*(\.\d+)?$/.test(value);

            
            if (isValidNumber) {
                const numericValue = parseFloat(value);
                if (numericValue === '') {
                    setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
                } else {
                    setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
                }
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please enter a valid number.' }));
            }
        }

        // customer location
        if (name === 'customer_location') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        /* form validation end here... */
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataSubmit = new FormData();
        formDataSubmit.append('customer_img', formData.customer_img);
        formDataSubmit.append('firstname', formData.firstname);
        formDataSubmit.append('middlename', formData.middlename);
        formDataSubmit.append('lastname', formData.lastname);
        formDataSubmit.append('contact_number', formData.contact_number);
        formDataSubmit.append('email', formData.email);
        formDataSubmit.append('customer_location', formData.customer_location);

        let hasError = false;
        for (const field in formDataError) {
            if (formDataError[field] === true) {
                hasError = true;
            }
        }

        if (formData.customer_img === "" && editIndex === 0) {
            setFormDataError((prevError) => ({ ...prevError, customer_img: true }));
            setFormDataHelperText((prevText) => ({ ...prevText, customer_img: 'Please provide customer image.' }));
            handleSnackbar(true, 'Oops, something went wrong. Please provide customer image.');
        } else if (hasError) {
            handleSnackbar(true, 'Oops, something went wrong. Please check for any errors.');
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_post_header_file(update_Customer + formData.id, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    refresh_table();
                    handleSnackbar(true, response.data.message);
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error);
                });
            } else {
                axios_post_header_file(add_Customer, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    refresh_table();
                    handleSnackbar(true, response.data.message);
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error);
                });
            }
        }
    };

    const handleRemoveSubmit = (e) => {
        e.preventDefault();

        setLoading(true);
        axios_patch_header('/delivery_hub/customer/remove_customer/' + formData.id, {}, decrypted_access_token)
        .then(response => {
            setLoading(false);
            handleRemoveDialog(false);
            refresh_table();
            handleSnackbar(true, response.data.message);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        })
    };

    // previewing of uploaded image
    const imgPreview = () => {
        if (imgSrc !== '' && editIndex === 0) {
            return (
                <img src={imgSrc} alt="Upload Preview" style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            );
        } else if ((editIndex === 1 || editIndex === 2) && formData.id !== '') {
            return (
                <img src={imgSrc} alt="Preview Customer Image" style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            );
        } else {
            return '';
        }
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" sx={{ px: 2, mt: 5 }}>
            {/* snackbar or alert dialog */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => handleSnackbar(false, '')} message={snackbar.message} action={action} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />

            {/* create and update dialog */}
            <Dialog open={dialog} fullWidth maxWidth="md">
                <DialogTitle>{editIndex === 0 ? 'Add New' : (editIndex === 1 ? 'Update' : 'View')} Customer {editIndex === 2 || editIndex === 1 ? 'Details' : ''}</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container direction="column" rowSpacing={2}>
                        <Grid item>
                            { editIndex !== 2 ?
                                <TextField
                                label={editIndex === 2 ? '' : 'Customer Picture'}
                                type="file"
                                name="customer_img"
                                error={formDataError.customer_img}
                                helperText={formDataHelperText.customer_img}
                                onChange={handleChange}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><AttachmentOutlined /></InputAdornment>,
                                }}
                                disabled={editIndex === 2}
                                inputProps={{ accept: 'image/png, image/jpeg, image/jpg, image/gif' }}
                                fullWidth
                            /> : ''
                            }
                            {imgPreview && (
                                <div>{imgPreview()}</div>
                            )}
                        </Grid>
                        <Grid item>
                            <TextField
                                label="First Name"
                                name="firstname"
                                value={formData.firstname}
                                error={formDataError.firstname}
                                helperText={formDataHelperText.firstname}
                                onChange={handleChange}
                                disabled={editIndex === 2}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Middle Initial/Name"
                                placeholder="Optional"
                                name="middlename"
                                value={formData.middlename}
                                onChange={handleChange}
                                disabled={editIndex === 2}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Last Name"
                                name="lastname"
                                value={formData.lastname}
                                error={formDataError.lastname}
                                helperText={formDataHelperText.lastname}
                                onChange={handleChange}
                                disabled={editIndex === 2}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Contact Number"
                                name="contact_number"
                                value={formData.contact_number}
                                error={formDataError.contact_number}
                                helperText={formDataHelperText.contact_number}
                                onChange={handleChange}
                                disabled={editIndex === 2}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="E-mail Address"
                                name="email"
                                value={formData.email}
                                error={formDataError.email}
                                helperText={formDataHelperText.email}
                                onChange={handleChange}
                                disabled={editIndex === 2}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Customer Location"
                                name="customer_location"
                                value={formData.customer_location}
                                error={formDataError.customer_location}
                                helperText={formDataHelperText.customer_location}
                                onChange={handleChange}
                                disabled={editIndex === 2}
                                multiline
                                rows={3}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mr: 2, mb: 1.5 }}>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelOutlined fontSize="small" />} onClick={() => handleDialog(false)}>{editIndex === 2 ? 'Close' : 'Cancel'}</Button>
                        </Grid>
                        {editIndex !== 2 && (
                            <Grid item>
                                {loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>{editIndex === 1 ? 'Updating' : 'Adding New'} Customer</LoadingButton> : <Button variant="contained" color="primary" endIcon={editIndex === 1 ? <EditOutlined fontSize="small" /> : <PersonAddAltOutlined fontSize="small" />} onClick={handleSubmit}>{editIndex === 1 ? 'Update' : 'Add New'} Customer</Button>}
                            </Grid>
                        )}
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* customer payment dialog */}
            <Dialog open={paymentDialog} onClose={() => handlePaymentDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Customer Payment Details</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container direction="column" rowSpacing={2}>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="customer_payment_status">Customer Payment Status</InputLabel>
                                <Select
                                    labelId="customer_payment_status"
                                    id="customer_payment_status"
                                    label="Customer Payment Status"
                                    name="customer_payment_status"
                                    value={formData.customer_payment_status}
                                    error={formDataError.customer_payment_status}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value={0}>None</MenuItem>
                                    <MenuItem value={1}>Fully Paid</MenuItem>
                                    <MenuItem value={2}>Partially Paid</MenuItem>
                                    <MenuItem value={3}>Unpaid</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Amount Paid"
                                name="customer_payment_amnt"
                                value={formData.customer_payment_amnt}
                                error={formDataError.customer_payment_amnt}
                                helperText={formDataHelperText.customer_payment_amnt}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Credit Amount"
                                name="customer_payment_amnt"
                                value={formData.customer_credit_amnt}
                                disabled
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* remove dialog */}
            <Dialog open={removeDialog} onClose={() => handleRemoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Remove Customer?</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to remove this customer?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mb: 1, mr: 1.5 }}>
                        <Grid item>
                            <Button variant="contained" color="primary" endIcon={<CancelOutlined fontSize="small" />} onClick={() => handleRemoveDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            {loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Removing Customer</LoadingButton> : <Button variant="contained" color="error" endIcon={<PersonRemoveAlt1Outlined fontSize="small" />} onClick={handleRemoveSubmit}>Remove Customer</Button>}
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* buttons */}
            <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 2, xl: 1. }}>
                <Grid item>
                    <Button variant="contained" color="primary" endIcon={<RefreshOutlined />} onClick={refresh_table}>Refresh Table</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" endIcon={<GroupAddOutlined />} onClick={() => handleDialog(true)}>Add New Customer</Button>
                </Grid>
            </Grid>

            {/* table definitions */}
            <Grid container direction="row" justifyContent="center" sx={{ mt: 2 }}>
                <Grid item lg={12} xl={12}>
                    <Card raised sx={{ width: '100%' }}>
                        <CardContent>
                            <DataGrid columns={columns} rows={rows} autoHeight loading={tableLoading} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Customers;