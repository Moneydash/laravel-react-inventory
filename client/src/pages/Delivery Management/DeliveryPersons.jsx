import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Snackbar, TextField, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from "@mui/lab";
import { AttachmentOutlined, CancelOutlined, CloseRounded, DeleteRounded, GroupAddOutlined, InfoOutlined, PersonRemoveAlt1Outlined, RefreshOutlined } from '@mui/icons-material';
import { axios_get_header, axios_patch_header, axios_post_header_file } from "utils/requests";
import { decryptAccessToken } from "utils/auth";
import { validate } from "email-validator";
import VisuallyHidden from "components/elements/FileInputComponent";
import {
    get_Delivery_persons,
    get_Delivery_person,
    get_Primary_ids,
    get_Secondary_ids,
    add_Delivery_person,
    remove_Delivery_person
} from 'utils/services';

function DeliveryPersons() {
    document.title = 'InventoryIQ: Delivery Hub - Delivery Personnel';
    const decrypted_access_token = decryptAccessToken();
    const empty_field_warning = 'Please fill up required field!';

    const renderActionButtons = (params) => {
        return <div>
            <IconButton onClick={() => get_delivery_person(2, params.value)} color="primary">
                <Tooltip title="View Personnel Information" placement="bottom" arrow><InfoOutlined fontSize="small"/></Tooltip>
            </IconButton>
            <IconButton onClick={() => get_delivery_person(3, params.value)} color="error" sx={{ ml: 1 }}>
                <Tooltip title="Update Personnel Information" placement="bottom" arrow><DeleteRounded fontSize="small"/></Tooltip>
            </IconButton>
        </div>
    };
    
    const columns = [
        { field: 'firstname', headerName: 'First Name', flex: 1 },
        { field: 'lastname', headerName: 'Last Name', flex: 1 },
        { field: 'contact_number', headerName: 'Contact Number', flex: 1 },
        { field: 'email', headerName: 'E-mail Address', flex: 1 },
        { field: 'primary_id', headerName: 'Primary ID Used', flex: 1 },
        { field: 'secondary_id', headerName: 'Secondary ID Used', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];
    const [editIndex, setEditIndex] = useState(0);
    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [removeDialog, setRemoveDialog] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [primaryIds, setPrimaryIds] = useState([]);
    const [secondaryIds, setSecondaryIds] = useState([]);
    const [primaryIdImgSrc, setPrimaryIdImgSrc] = useState('');
    const [secondaryIdImgSrc, setSecondaryIdImgSrc] = useState('');
    const initialSnackbar = {
        open: false,
        message: ''
    };
    const [snackbar, setSnackbar] = useState(initialSnackbar);
    const initialFormData = {
        id: '',
        firstname: '',
        middlename: '',
        lastname: '',
        primaryID_id: '',
        primary_id_img: '',
        primary_id_img_name: '',
        secondaryID_id: '',
        secondary_id_img: '',
        secondary_id_img_name: '',
        contact_number: '',
        email_address: '',
        home_address: ''
    };
    const initialFormDataError = {
        firstname: false,
        lastname: false,
        primaryID_id: false,
        primary_id_img_name: false,
        secondaryID_id: false,
        secondary_id_img_name: false,
        contact_number: false,
        email_address: false,
        home_address: false
    };
    const initialFormDataHelperText = {
        firstname: '',
        lastname: '',
        primaryID_id: '',
        primary_id_img_name: '',
        secondary_id_img_name: '',
        contact_number: '',
        email_address: '',
        home_address: ''
    };
    
    const [formData, setFormData] = useState(initialFormData);
    const [formDataError, setFormDataError] = useState(initialFormDataError);
    const [formDataHelperText, setFormDataHelperText] = useState(initialFormDataHelperText);

    const get_delivery_persons = async () => {
        setRows([]);
        setTableLoading(true);
        axios_get_header(get_Delivery_persons, decrypted_access_token)
        .then(response => {
            const data = response.data;
            const transformedData = data.delivery_persons.map(delivery_person => {
                return {
                    id: delivery_person['id'],
                    firstname: delivery_person['firstname'],
                    lastname: delivery_person['lastname'],
                    contact_number: delivery_person['contact_number'],
                    email: delivery_person['email_address'],
                    primary_id: delivery_person['primary_id']['id_name_abbr'],
                    secondary_id: delivery_person['secondary_id']['id_name_abbr'] === null ? 'None' : delivery_person['secondary_id']['id_name_abbr']
                };
            });

            setRows(transformedData);
            setTableLoading(false);
        })
        .catch(error => {
            setTableLoading(false);
            handleSnackbar(true, 'Oops, something went wrong. Please try again later.');
            console.log(error);
        })
    }

    /* eslint-disable */
    useEffect(() => {
        get_delivery_persons();
    }, []);
    /* eslint-disable */

    const refresh_table = () => {
        get_delivery_persons();
    }

    const get_delivery_person = (editIndexValue, id) => {
        setEditIndex(2);
        axios_get_header(get_Delivery_person + id, decrypted_access_token)
        .then(response => {
            get_primary_ids();
            get_secondary_ids();
            const data = response.data.delivery_personnel_info;
            const cleanedPath_primary = data.primary_id_img.substring(data.primary_id_img.indexOf('/') + 1);
            const cleanedPath_secondary = data.secondary_id_img.substring(data.secondary_id_img.indexOf('/') + 1);
            setFormData((prevState) => ({
                ...prevState,
                id: data.id,
                firstname: data.firstname,
                middlname: data.middlename === null ? '' : data.middlename,
                lastname: data.lastname,
                primaryID_id: data.primaryID_id,
                secondaryID_id: data.secondaryID_id,
                contact_number: data.contact_number,
                email_address: data.email_address,
                home_address: data.home_address
            }));
            setPrimaryIdImgSrc(process.env.REACT_APP_API_BASE_IMG_URL + cleanedPath_primary);
            setSecondaryIdImgSrc(process.env.REACT_APP_API_BASE_IMG_URL + cleanedPath_secondary);
            if (editIndexValue === 2) {
                handleDialog(true);
            } else if (editIndexValue === 3) {
                setRemoveDialog(true);
            }
        })
        .catch(error => {
            console.log(error);
            handleSnackbar(true, 'Oops, something went wrong. Please try again later.');
        });
    };

    const get_primary_ids = () => {
        axios_get_header(get_Primary_ids, decrypted_access_token)
        .then(response => { setPrimaryIds(response.data.primary_ids); })
        .catch(error => { console.log(error); });
    }

    const get_secondary_ids = () => {
        axios_get_header(get_Secondary_ids, decrypted_access_token)
        .then(response => { setSecondaryIds(response.data.secondary_ids) })
        .catch(error => { console.log(error); });
    };

    const handleSnackbar = (open, message) => {
        setSnackbar((prevSnack) => ({ ...prevSnack, open: open, message: message }))
    };
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

    const handleDialog = (open) => {
        setDialog(open);
        if (open === false) {
            setFormData(initialFormData);
            setPrimaryIds([]);
            setSecondaryIds([]);
            setFormDataError(initialFormDataError);
            setFormDataHelperText(initialFormDataHelperText);
            setSecondaryIdImgSrc('');
            setPrimaryIdImgSrc('');
        } else {
            get_primary_ids();
            get_secondary_ids();
        }
    };

    const handRemoveDialog = (open) => {
        setRemoveDialog(open);
        if (open === false) {
            setFormData(initialFormData);
        }
    };

    // change inputs and form validation
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'firstname' || name === 'lastname') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));

            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else if (value.length < 2) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: `Please enter a valid ${name} with at least 2 characters.` }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'middlename') { setFormData((prevState) => ({ ...prevState, [name]: value })); }

        if (name === 'primaryID_id') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'secondaryID_id') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, secondary_id_img_name: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, secondary_id_img_name: '' }));
            }
        }
        
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

        if (name === 'email_address') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));

            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            } else if (!validate(value)) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please enter a valid email address.' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'primary_id_img' || name === 'secondary_id_img') {
            const file = files[0];

            if (file) {
                const filereader = new FileReader();
                filereader.readAsDataURL(file);
                if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/gif') {
                    if (file.size <= parseInt((5 * 1024) * 1024)) {
                        filereader.onloadend = function(e) {

                            if (name === 'primary_id_img') {
                                setPrimaryIdImgSrc(filereader.result);
                            } else if (name === 'secondary_id_img') {
                                setSecondaryIdImgSrc(filereader.result);
                            }

                            setFormData((prevState) => ({ ...prevState, [name]: file }));
                            setFormData((prevState) => ({ ...prevState, [name + '_name']: file.name }));
                            setFormDataError((prevError) => ({ ...prevError, [name + '_name']: false }));
                            setFormDataHelperText((prevText) => ({ ...prevText, [name + '_name']: '' }));
                        }
                    } else {

                        if (name === 'primary_id_img') {
                            setPrimaryIdImgSrc('');
                        } else if (name === 'secondary_id_img') {
                            setSecondaryIdImgSrc('');
                        }

                        setFormData((prevState) => ({ ...prevState, [name]: '' }));
                        setFormData((prevState) => ({ ...prevState, [name + '_name']: '' }));
                        setFormDataError((prevError) => ({ ...prevError, [name + '_name']: true }));
                        setFormDataHelperText((prevText) => ({ ...prevText, [name + '_name']: 'File size limit is 5MB, please select another file.' }));
                    }
                } else {

                    if (name === 'primary_id_img') {
                        setPrimaryIdImgSrc('');
                    } else if (name === 'secondary_id_img') {
                        setSecondaryIdImgSrc('');
                    }

                    setFormData((prevState) => ({ ...prevState, [name]: '' }));
                    setFormData((prevState) => ({ ...prevState, [name + '_name']: '' }));
                    setFormDataError((prevError) => ({ ...prevError, [name + '_name']: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name + '_name']: 'Please select a valid image file (png, jpeg, jpg or gif)' }));
                }
            }
        }

        if (name === 'home_address') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));

            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }
    };

    // form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataSubmit = new FormData();
        formDataSubmit.append('firstname', formData.firstname);
        formDataSubmit.append('middlename', formData.middlename);
        formDataSubmit.append('lastname',  formData.lastname);
        formDataSubmit.append('primaryID_id', formData.primaryID_id);
        formDataSubmit.append('primary_id_img', formData.primary_id_img);
        formDataSubmit.append('secondaryID_id', formData.secondaryID_id);
        formDataSubmit.append('secondary_id_img', formData.secondary_id_img);
        formDataSubmit.append('contact_number', formData.contact_number);
        formDataSubmit.append('email_address', formData.email_address);
        formDataSubmit.append('home_address', formData.home_address);

        let hasError = false;
        for (const field in formData) {
            if (formDataError[field] === true) {
                hasError = true;
            }
        }

        if (hasError === true) {
            handleSnackbar(true, 'Oops, something went wrong. Please check for errors.');
        } else if (formData.primaryID_id === '' && formData.primary_id_img === '') {
            handleSnackbar(true, 'Please provide primary government ID for the delivery personnel.');
            setFormDataError((prevError) => ({ ...prevError, primaryID_id: true, primary_id_img_name: true }));
            setFormDataHelperText((prevText) => ({ ...prevText, primaryID_id: empty_field_warning, primary_id_img_name: empty_field_warning }));
        } else if (formData.secondaryID_id !== '' && formData.secondary_id_img === '') {
            handleSnackbar(true, 'Since you\'ve chosen a secondary government ID for the delivery personnel, please make sure to upload a corresponding picture. If you cannot provide a picture for the secondary ID, consider deselecting it.');
            setFormDataError((prevError) => ({ ...prevError, secondary_id_img_name: true }));
            setFormDataHelperText((prevText) => ({ ...prevText, secondary_id_img_name: 'Please provide image for this field!' }));
        } else {
            setLoading(true);
            axios_post_header_file(add_Delivery_person, formDataSubmit, decrypted_access_token)
            .then(response => {
                setLoading(false);
                handleDialog(false);
                handleSnackbar(true, response.data.message);
                get_delivery_persons();
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
                handleSnackbar(true, 'Oops, something went wrong. Please try again later.');
            });
        }
    };

    const handleRemoveSubmit = () => {
        setLoading(true);
        axios_patch_header(remove_Delivery_person + formData.id, {}, decrypted_access_token)
        .then(response => {
            handRemoveDialog(false);
            setLoading(false);
            refresh_table();
            handleSnackbar(true, response.data.message);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            handleSnackbar(true, 'Oops, something went wrong. Please try again later.');
        })
    };

    // image preview for primary id
    const primaryIdImgPreview = () => {
        if (primaryIdImgSrc !== '' && editIndex === 0) {
            return (
                <img src={primaryIdImgSrc} alt="Upload Preview" style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            );
        } else if (editIndex === 2 && primaryIdImgSrc !== '') {
            return (
                <img src={primaryIdImgSrc} alt="Preview Primary ID" style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            );
        } else {
            return '';
        }
    };

    // image preview for secondary id
    const secondaryIdImgPreview = () => {
        if (secondaryIdImgSrc !== '' && editIndex === 0) {
            return (
                <img src={secondaryIdImgSrc} alt="Upload Preview" style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            )
        } else if (editIndex === 2 && secondaryIdImgSrc !== '') {
            return (
                <img src={secondaryIdImgSrc} alt="Preview Secondary ID" style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            );
        } else {
            return '';
        }
    };

    return (
        <Grid container direction="row" justifyContent="flex-start" sx={{ px: 2, mt: 5 }}>
            {/* snackbar or alert dialog */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => handleSnackbar(false, '')} message={snackbar.message} action={action} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />

            {/* create and view dialog */}
            <Dialog open={dialog} fullWidth maxWidth="lg">
                <DialogTitle>Add Delivery Personnel</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container direction="row" rowSpacing={2.5} columnSpacing={2}>
                        <Grid item lg={6} xl={6}>
                            <Grid container direction="column" rowSpacing={2.5}>
                                <Grid item>
                                    <TextField
                                        label="First Name"
                                        variant="outlined"
                                        name="firstname"
                                        value={formData.firstname}
                                        error={formDataError.firstname}
                                        helperText={formDataHelperText.firstname}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: editIndex === 2 ? true : false
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Middle Name / Initial"
                                        variant="outlined"
                                        name="middlename"
                                        value={formData.middlename}
                                        placeholder="Optional"
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: editIndex === 2 ? true : false
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Last Name"
                                        variant="outlined"
                                        name="lastname"
                                        value={formData.lastname}
                                        error={formDataError.lastname}
                                        helperText={formDataHelperText.lastname}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: editIndex === 2 ? true : false
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <InputLabel id="primaryID_id">Primary ID</InputLabel>
                                        <Select
                                            labelId="primaryID_id"
                                            id="primaryID_id"
                                            label="primaryID_id"
                                            name="primaryID_id"
                                            value={formData.primaryID_id}
                                            error={formDataError.primaryID_id}
                                            onChange={handleChange}
                                            disabled={editIndex === 2}
                                            fullWidth
                                        >
                                            {primaryIds.map(primary_id => (
                                                <MenuItem key={primary_id.id} value={primary_id.id}>
                                                    { primary_id.id_name_abbr }
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="primary_id_img_filename"
                                        error={formDataError.primary_id_img_name}
                                        helperText={formDataHelperText.primary_id_img_name}
                                        placeholder="Primary ID Image"
                                        value={formData.primary_id_img_name}
                                        InputProps={{
                                            startAdornment: (
                                            <InputAdornment position="start">
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    sx={{ ml: -1 }}
                                                    component="label"
                                                    disabled={editIndex === 2}
                                                >
                                                    Upload Image
                                                    <VisuallyHidden type="file" name="primary_id_img" accept=".png, .jpeg, .jpg, .gif" onChange={handleChange} />
                                                </Button>
                                            </InputAdornment>
                                            ),
                                            endAdornment: <InputAdornment position="end"><AttachmentOutlined /></InputAdornment>,
                                            readOnly: true
                                        }}
                                    />
                                    {primaryIdImgPreview && (
                                        <div>{primaryIdImgPreview()}</div>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={6} xl={6}>
                            <Grid container direction="column" rowSpacing={2.5}>
                                <Grid item>
                                    <TextField
                                        label="Contact Number"
                                        variant="outlined"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        error={formDataError.contact_number}
                                        helperText={formDataHelperText.contact_number}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: editIndex === 2 ? true : false
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="E-mail Address"
                                        placeholder="Optional"
                                        variant="outlined"
                                        name="email_address"
                                        type="email"
                                        value={formData.email_address}
                                        error={formDataError.email_address}
                                        helperText={formDataHelperText.email_address}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: editIndex === 2 ? true : false
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <InputLabel id="secondaryID_id">Secondary ID (Optional)</InputLabel>
                                        <Select
                                            labelId="secondaryID_id"
                                            id="secondaryID_id"
                                            label="secondaryID_id"
                                            name="secondaryID_id"
                                            value={secondaryIds.length > 0 ? formData.secondaryID_id || '' : ''}
                                            onChange={handleChange}
                                            disabled={editIndex === 2}
                                            fullWidth
                                        >
                                            {secondaryIds.length > 0 ? (
                                                [
                                                    <MenuItem key="empty" value="">&nbsp;</MenuItem>,
                                                    ...secondaryIds.map(secondary_id => (
                                                        <MenuItem key={secondary_id.id} value={secondary_id.id}>
                                                            {secondary_id.id_name_abbr}
                                                        </MenuItem>
                                                    ))
                                                ]
                                            ) : (
                                                <MenuItem value="">&nbsp;</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="secondary_id_img_name"
                                        value={formData.secondary_id_img_name}
                                        error={formDataError.secondary_id_img_name}
                                        helperText={formDataHelperText.secondary_id_img_name}
                                        placeholder="Secondary ID Image"
                                        InputProps={{
                                            startAdornment: (
                                            <InputAdornment position="start">
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    sx={{ ml: -1 }}
                                                    component="label"
                                                    disabled={editIndex === 2}
                                                >
                                                    Upload Image
                                                    <VisuallyHidden type="file" accept=".png, .jpeg, .jpg, .gif" name="secondary_id_img" onChange={handleChange} />
                                                </Button>
                                            </InputAdornment>
                                            ),
                                            endAdornment: <InputAdornment position="end"><AttachmentOutlined /></InputAdornment>,
                                            readOnly: true
                                        }}
                                    />
                                    {secondaryIdImgPreview && (
                                        <div>{secondaryIdImgPreview()}</div>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={12} xl={12}>
                            <TextField
                                label="Home Address"
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                                name="home_address"
                                value={formData.home_address}
                                error={formDataError.home_address}
                                helperText={formDataHelperText.home_address}
                                onChange={handleChange}
                                InputProps={{
                                    readOnly: editIndex === 2 ? true : false
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelOutlined />} onClick={() => handleDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            { loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Adding Delivery Personnel</LoadingButton> : <Button color="primary" variant="contained" endIcon={<GroupAddOutlined />} onClick={handleSubmit}>Add Delivery Personnel</Button> }
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* remove dialog */}
            <Dialog open={removeDialog} onClose={() => handRemoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Remove Delivery Personnel Details</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to remove this Delivery Personnel?</Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 2, xl: 2 }} sx={{ mr: 1.5, mb: 1 }}>
                        <Grid item>
                            <Button color="primary" endIcon={<CancelOutlined />} variant="contained" onClick={() => handRemoveDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            {loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Removing Delivery Personnel</LoadingButton> : <Button color="error" endIcon={<PersonRemoveAlt1Outlined />} onClick={handleRemoveSubmit} variant="contained">Remove Delivery Personnel</Button>}
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* buttons */}
            <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1.5, xl: 1.5 }}>
                <Grid item>
                    <Button variant="contained" color="primary" endIcon={<RefreshOutlined />} onClick={refresh_table}>Refresh Table</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" endIcon={<GroupAddOutlined />} onClick={() => handleDialog(true)}>Add Delivery Personnel</Button>
                </Grid>
            </Grid>

            {/* table rendering */}
            <Grid container justifyContent="center" direction="row" sx={{ mt: 2 }}>
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

export default DeliveryPersons;