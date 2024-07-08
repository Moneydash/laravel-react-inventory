import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LoadingButton } from "@mui/lab";
import { CancelOutlined, DeleteRounded, GroupAddOutlined, InfoOutlined, PersonRemoveAlt1Outlined, RefreshOutlined } from '@mui/icons-material';
import { axios_get_header, axios_patch_header, axios_post_header_file } from "utils/requests";
import { decryptAccessToken } from "utils/auth";
import { validate } from "email-validator";
import {
    get_Delivery_persons,
    get_Delivery_person,
    get_Primary_ids,
    get_Secondary_ids,
    add_Delivery_person,
    remove_Delivery_person
} from 'utils/services';
import AddUpdateContent from "components/pages/Delivery Management/DeliveryPersons/Add_Update";
import { apiGetHelper, crumbsHelper, fileNameSplit, nullCheck, pathCleaner, phNumRegex, setData, setErrorHelper, validate_image_preview } from "utils/helper";
import { toast } from "react-toastify";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { ErrorColorBtn, ErrorColorIconBtn, PrimaryColorIconBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";

function DeliveryPersons() {
    document.title = 'InventoryIQ: Delivery Hub - Delivery Personnel';
    const decrypted_access_token = decryptAccessToken();
    const empty_field_warning = 'Please fill up required field!';

    const renderActionButtons = (params) => {
        return <>
            <PrimaryColorIconBtn
                fn={() => get_delivery_person(2, params.value)}
                title="View Personnel Information"
                icon={<InfoOutlined fontSize="small" />}
            />
            <ErrorColorIconBtn
                fn={() => get_delivery_person(3, params.value)}
                title="Remove Personnel Information"
                icon={<DeleteRounded fontSize="small" />}
                sx={{ ml: 1 }}
            />
        </>
    };
    
    const columns = [
        { field: 'firstname', headerName: 'First Name', flex: 1 },
        { field: 'lastname', headerName: 'Last Name', flex: 1 },
        { field: 'contact_number', headerName: 'Contact Number', flex: 1 },
        {
            field: 'email',
            headerName: 'E-mail Address',
            flex: 1,
            valueGetter: (params) => params.row?.email_address || 'N/A' 
        },
        {
            field: 'primary_id',
            headerName: 'Primary ID Used',
            flex: 1,
            valueGetter: (params) => params.row?.primary_id?.name
        },
        {
            field: 'secondary_id',
            headerName: 'Secondary ID Used',
            flex: 1,
            valueGetter: (params) => params.row?.secondary_id?.name || 'N/A'
        },
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
    const [forceRender, setForceRender] = useState(false);
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
            const personnels = data?.delivery_persons;
            setRows(personnels);
            setTableLoading(false);
        })
        .catch(error => {
            setTableLoading(false);
            toast.error('Oops, something went wrong. Please try again later.');
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

    const get_delivery_person = async (editIndexValue, id) => {
        try {
            const response = await axios_get_header(get_Delivery_person + id, decrypted_access_token)
            const data = response.data;
            const info = data?.delivery_personnel_info;
            setEditIndex(editIndexValue);
            
            if (editIndexValue === 2)  {
                get_primary_ids();
                get_secondary_ids();
                setFormData((prevState) => ({
                    ...prevState,
                    id: info?.id,
                    firstname: info?.firstname,
                    middlname: nullCheck(info?.middlename) ? '' : data.middlename,
                    lastname: info?.lastname,
                    primaryID_id: info?.primaryID_id,
                    secondaryID_id: nullCheck(info?.secondary_id_img) ? '' : info?.secondaryID_id,
                    primary_id_img_name: fileNameSplit(info?.primary_id_img),
                    secondary_id_img_name: nullCheck(info?.secondary_id_img) ? '' : fileNameSplit(info?.secondary_id_img),
                    contact_number: info?.contact_number,
                    email_address: info?.email_address,
                    home_address: info?.home_address
                }));
                setPrimaryIdImgSrc(process.env.REACT_APP_API_BASE_IMG_URL + pathCleaner(info?.primary_id_img));
                if (!nullCheck(info?.secondary_id_img)) {
                    setSecondaryIdImgSrc(process.env.REACT_APP_API_BASE_IMG_URL + pathCleaner(info?.secondary_id_img));
                }
                handleDialog(true);
            } else if (editIndexValue === 3) {
                setData(setFormData, 'id', info?.id);
                setRemoveDialog(true);
            }
        } catch(error) {
            toast.error('Oops, something went wrong. Please try again later.');
            console.log(error);
            throw error;
        };
    };

    const get_primary_ids = () => {
        apiGetHelper(get_Primary_ids, setPrimaryIds, 'primary_ids');
    }

    const get_secondary_ids = () => {
        apiGetHelper(get_Secondary_ids, setSecondaryIds, 'secondary_ids');
    };

    const handleDialog = (open) => {
        setDialog(open);
        if (!open) {
            setFormData(initialFormData);
            setPrimaryIds([]);
            setSecondaryIds([]);
            setFormDataError(initialFormDataError);
            setFormDataHelperText(initialFormDataHelperText);
            setSecondaryIdImgSrc('');
            setPrimaryIdImgSrc('');
            setEditIndex(0);
        } else {
            get_primary_ids();
            get_secondary_ids();
        }
    };

    const handRemoveDialog = (open) => {
        setRemoveDialog(open);
        if (!open) {
            setFormData(initialFormData);
        }
    };

    // change inputs and form validation
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        switch (name) {
            case 'firstname':
            case 'lastname':
            case 'home_address':
                setData(setFormData, name, value);
                
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (value.length < 2) {
                    setErrorHelper(
                        name,
                        true, 
                        `Please enter a valid ${name} with at least 2 characters`, // applicable also if they type QC
                        setFormDataError,
                        setFormDataHelperText
                    );
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;

            case 'primaryID_id':
                setData(setFormData, name, value);

                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;

            case 'contact_number':
                setData(setFormData, name, value);

                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (!phNumRegex(value)) {
                    setErrorHelper(
                        name,
                        true,
                        'Please enter a valid Philippine mobile number. It should start with \'09\' or \'+639\' followed by 9 digits.',
                        setFormDataError,
                        setFormDataHelperText
                    );
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;

            case 'secondaryID_id':
                setData(setFormData, name, value);
            
                // remove error on upload image field if no selected secondary id
                if (nullCheck(value)) {
                    setErrorHelper('secondary_id_img_name', false, '', setFormDataError, setFormDataHelperText);
                }
                break;

            case 'email_address':
                setData(setFormData, name, value);

                if (nullCheck(value)) {
                    // some delivery personnel don't have email (mostly if they're from the province and just delivering items)
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                } else if (!validate(value)) {
                    setErrorHelper(name, true, 'Please enter a valid email address.', setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;

            case 'primary_id_img':
                const prime_id = files[0];
                validate_image_preview(
                    prime_id,
                    name,
                    setPrimaryIdImgSrc,
                    setFormData,
                    setFormDataError,
                    setFormDataHelperText
                );
                break
            case 'secondary_id_img':
                const second_id = files[0];
                validate_image_preview(
                    second_id,
                    name,
                    setSecondaryIdImgSrc,
                    setFormData,
                    setFormDataError,
                    setFormDataError
                );
                break;
            default:
                setData(setFormData, name, value);
                break;
        }
    };

    // form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        let hasError = false;
        let isPrimaryEmpty = nullCheck(formData?.primaryID_id) && nullCheck(formData?.primary_id_img);
        let isSecondaryRequired = !nullCheck(formData?.secondaryID_id) && nullCheck(formData?.secondary_id_img);
        let excluded = ['primary_id_img_name', 'secondary_id_img_name'];

        const formDataSubmit = new FormData();
        for (const field in formData) {
            // exclude the excluded fields
            if (!excluded.includes(field)) {
                
                // make the secondary id's fields null if empty
                if (field === 'secondaryID_id' || field === 'secondary_id_img') {
                    if (nullCheck(formData[field])) {
                        formDataSubmit.append(field, null);
                    } else {
                        formDataSubmit.append(field, formData[field]);
                    }
                } else {
                    formDataSubmit.append(field, formData[field]);
                }
            }

            if (formDataError[field] === true) {
                hasError = true;
            }
        }

        if (hasError === true) {
            toast.error('Oops, something went wrong. Please check for errors.');
        } else if (isPrimaryEmpty) {
            toast.error('Please provide primary government ID for the delivery personnel.');
            setErrorHelper('primary_id_img_name', true, empty_field_warning, setFormDataError, setFormDataHelperText);
        } else if (isSecondaryRequired) {
            toast.error('Since you\'ve chosen a secondary government ID for the delivery personnel, please make sure to upload a corresponding picture. If you cannot provide a picture for the secondary ID, consider deselecting it.');
            setErrorHelper('secondary_id_img_name', true, 'Please provide image for this field!', setFormDataError, setFormDataHelperText);
        } else {
            setLoading(true);
            axios_post_header_file(add_Delivery_person, formDataSubmit, decrypted_access_token)
            .then(response => {
                setLoading(false);
                handleDialog(false);
                toast.success(response.data.message);
                get_delivery_persons();
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
                toast.error('Oops, something went wrong. Please try again later.');
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
            toast.success(response.data.message);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            toast.error('Oops, something went wrong. Please try again later.');
        })
    };

    // image preview for primary id
    const primaryIdImgPreview = () => {
        if (primaryIdImgSrc !== '' && (editIndex === 0 || editIndex === 2)) {
            const altText = editIndex === 0 ? "Upload Preview" : "Preview Primary ID";
            return (
                <img src={primaryIdImgSrc} alt={altText} style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            );
        }
        return null;
    };

    // image preview for secondary id
    const secondaryIdImgPreview = () => {
        if (secondaryIdImgSrc !== '' && (editIndex === 0 || editIndex === 2)) {
            const altText = editIndex === 0 ? "Upload Preview" : "Preview Secondary ID";
            return (
                <img src={secondaryIdImgSrc} alt={altText} style={{ width: '80px', height: '80px', marginTop: '5px', marginLeft: '5px' }} />
            );
        }
        return null;
    };

    return (
        <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{ px: 2, mt: 3 }} display="flex">
            {/* create and view dialog */}
            <Dialog open={dialog} fullWidth maxWidth="lg">
                <DialogTitle>Add Delivery Personnel</DialogTitle>
                <Divider />
                <DialogContent>
                    <AddUpdateContent
                        formData={formData}
                        formDataError={formDataError}
                        formDataHelperText={formDataHelperText}
                        handleChange={handleChange}
                        editIndex={editIndex}
                        primaryIds={primaryIds}
                        primaryIdImgPreview={primaryIdImgPreview}
                        secondaryIds={secondaryIds}
                        secondaryIdImgPreview={secondaryIdImgPreview}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <ErrorColorBtn
                                displayText={editIndex === 2 ? 'Close' : 'Cancel'}
                                endIcon={<CancelOutlined fontSize="small" />}
                                onClick={() => handleDialog(false)}
                            />
                        </Grid>
                        {editIndex === 0 ? (
                            <Grid item>
                                <PrimaryColorLoadingBtn
                                    displayText={editIndex === 2
                                        ? 'Adding Delivery Personnel'
                                        : 'Add Delivery Personnel'
                                    }
                                    endIcon={<GroupAddOutlined fontSize="small" />}
                                    onClick={handleSubmit}
                                    loading={loading}
                                />
                                {/* { loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Adding Delivery Personnel</LoadingButton> : <Button color="primary" variant="contained" endIcon={<GroupAddOutlined />} onClick={handleSubmit}>Add Delivery Personnel</Button> } */}
                            </Grid>
                        ) : ''}
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
                    <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mr: 1.5, mb: 1 }}>
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
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={crumbsHelper('Delivery Personnel', 'Delivery', '../delivery')}/>
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <Button variant="contained" color="primary" endIcon={<RefreshOutlined />} onClick={refresh_table}>Refresh Table</Button>
                        </Grid>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <Button variant="contained" color="primary" endIcon={<GroupAddOutlined />} onClick={() => handleDialog(true)}>Add Delivery Personnel</Button>
                        </Grid>
                    </Grid>
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