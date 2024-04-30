import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Tooltip
} from "@mui/material";
import {
    AddBoxOutlined,
    CancelOutlined,
    DeleteRounded,
    DownloadRounded,
    EditRounded,
    GroupAddOutlined,
    GroupRemoveOutlined,
    RefreshOutlined,
    RestoreOutlined
} from "@mui/icons-material";
import * as EmailValidator from 'email-validator';
import {
    axios_delete_header,
    axios_get_header,
    axios_post_header_file,
    axios_put_header
} from "utils/requests";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ToastCmp from "components/elements/ToastComponent";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import TableComponent from "components/elements/TableComponent";
import { decryptAccessToken } from "utils/auth";
import {
    get_Suppliers,
    get_Removed_suppliers,
    get_Supplier,
    restore_Supplier,
    update_Supplier,
    add_Supplier,
    remove_Supplier,
    download_Supplier_file,
} from 'utils/services';
import {
    crumbsHelper,
    downloadWithType,
    fileNameSplit,
    isoDateToCommon,
    nullCheck,
    phNumRegex,
    setData,
    setErrorHelper,
    validate_file
} from "utils/helper";
import AddUpdateContent from "components/pages/Inventory/Supplier/Add_Update";
import { ErrorColorIconBtn, PrimaryColorIconBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import Remove from "components/pages/Inventory/Supplier/Remove";
import DeletedContent from "components/pages/Inventory/Supplier/Deleted";

function Supplier() {
    document.title = "InventoryIQ: Supplier Partners";
    const decrypted_access_token = decryptAccessToken();
    const empty_field_warning = 'Please fill up required field!';

    const renderActionButtons = (params) => {
        return (
            <>
                <PrimaryColorIconBtn
                    title="Update Supplier Partner"
                    icon={<EditRounded fontSize="small"/>}
                    fn={() => get_supplier(params.value)}
                />
                <ErrorColorIconBtn
                    title="Remove Supplier Partner"
                    icon={<DeleteRounded fontSize="small"/>}
                    fn={() => remove_supplier(params.value)}
                />
                <PrimaryColorIconBtn
                    title="Download Terms and Conditions"
                    icon={<DownloadRounded fontSize="small"/>}
                    fn={() => downloadWithType(download_Supplier_file, params.value, 'terms')}
                />
                <PrimaryColorIconBtn
                    title="Download Contract Agreement"
                    icon={<DownloadRounded fontSize="small"/>}
                    fn={() => downloadWithType(download_Supplier_file, params.id, 'agreement')}
                />
            </>
        );
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
        agreement_name: ''

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
                return {
                    id: item?.id,
                    name: item?.name,
                    location: item?.location,
                    email: item?.email,
                    hotline: item?.hotline,
                    contact_person: item?.contact_person,
                    contact_person_number: item?.contact_person_number,
                    contract_expiry_date: isoDateToCommon(item?.contract_expiry_date)
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
            const terms_file = fileNameSplit(data.terms_and_conditions);
            const agreement_file = fileNameSplit(data.agreement);
            setFormData((prevState) => ({
                ...prevState,
                id: data?.id,
                name: data?.name,
                location: data?.location,
                email: data?.email,
                hotline: data?.hotline,
                contact_person: data?.contact_person,
                contact_person_number: data?.contact_person_number,
                contract_expiry_date: dayjs(data?.contract_expiry_date),
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
        
        switch(name) {
            case 'email':
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (!EmailValidator.validate(value)) {
                    setErrorHelper(name, true, 'Please enter a valid email address.', setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'contact_person_number':
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (!phNumRegex(value)) {
                    setErrorHelper(name, true, 'Please enter a valid Philippine mobile number. It should start with \'09\' or \'+639\' followed by 9 digits.', setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'terms':
            case 'agreement':
                const file = files[0];
                validate_file(file, 'file', name, setFormData, setFormDataError, setFormDataHelperText);
                break;
            default:
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText)
                }
                break;
        }
    };

    const handleDateChange = (date) => {
        const formattedDate = date ? dayjs(date) : '';
        setData(setFormData, 'contract_expiry_date', formattedDate);

        if (!formattedDate) {
            setErrorHelper('contract_expiry_date', true, empty_field_warning, setFormDataError, setFormDataHelperText);
        } else {
            setErrorHelper('contract_expiry_date', false, '', setFormDataError, setFormDataHelperText);
        }
    };

    // reset all fields on the form
    const formDataReset = () =>  {
        setFormData(initialFormData);
        setFormDataError(initialError);
        setFormDataHelperText(initialTextHelper);
    };

    const handleDialog = (open) => {
        setDialog(open);
        if (!open) {
            formDataReset();
            setEditIndex(0);
        }
    };

    // supplier creation or updates
    const handleSubmit = (e) => {
        e.preventDefault();
        
        let hasError = false;
        const excempted = ['terms_name', 'agreement_name'];
        const update_optional = ['terms', 'agreement'];

        for (const field in formData) {
            const isFieldEmpty = nullCheck(formData[field]);
            const isFieldError = formDataError[field] === true;

            if (editIndex === 1) {
                if (!update_optional.includes(field) && isFieldError) {
                    hasError = true;
                    setErrorHelper(field, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                }   
            } else if (editIndex === 0) {
                if (field !== 'id' && isFieldEmpty && isFieldError) {
                    hasError = true;
                    setErrorHelper(field, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                }
            }
        }

        const formDataSubmit = new FormData();
        for (const field in formData) {
            if (!excempted.includes(field)) {
                if (field === 'contract_expiry_date') {
                    const formattedDate = dayjs(formData.contract_expiry_date).format('YYYY-MM-DD');
                    formDataSubmit.append(field, formattedDate);
                } else {
                    formDataSubmit.append(field, formData[field]);
                }
            }
        }

        if (hasError) {
            toast.error('Oops, something went wrong. Please check for incorrect or empty fields.');
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_post_header_file(update_Supplier + formData.id, formDataSubmit, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    toast.success(response.data.message);
                    formDataReset();
                    get_suppliers();
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
                    formDataReset();
                    get_suppliers();
                })
                .catch(error => { setLoading(false); console.log(error); });
            }
        }
    };

    const handleRemove = (e) => {
        e.preventDefault();
        
        setLoading(true);
        axios_delete_header(`${remove_Supplier}${formData?.id}`, {}, decrypted_access_token)
        .then(response => {
            setLoading(false);
            setRemoveDialog(false);
            toast.success(response.data.message);
            formDataReset();
            get_suppliers();
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
                    <AddUpdateContent
                        formData={formData}
                        formDataError={formDataError}
                        formDataHelperText={formDataHelperText}
                        handleChange={handleChange}
                        handleDateChange={handleDateChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" sx={{ mr: 2, mb: 1 }} columnSpacing={{ lg: 1, xl: 1 }}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="error"
                                endIcon={<CancelOutlined fontSize="small"/>}
                                onClick={() => handleDialog(false)}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                displayText={loading && editIndex === 1
                                ? 'Updating Supplier'
                                : (!loading && editIndex === 1
                                ? 'Update Supplier'
                                : (loading && editIndex === 0
                                ? 'Adding Supplier'
                                : (!loading && editIndex === 0
                                ? 'Add Supplier'
                                : '')))}
                                endIcon={<AddBoxOutlined fontSize="small" />}
                                onClick={handleSubmit}
                                loading={loading}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* remove dialog */}
            <Remove
                removeDialog={removeDialog}
                setRemoveDialog={setRemoveDialog}
                loading={loading}
                handleRemove={handleRemove}
            />

            {/* dialog list for deleted suppliers */}
            <DeletedContent
                removerows={removerows}
                remove_columns={remove_columns}
                removeSupplierDialog={removeSupplierDialog}
                setRemoveSupplierDialog={setRemoveSupplierDialog}
            />

            {/* table buttons */}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={ crumbsHelper('Suppliers', 'Inventory', '../inventory') } />
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