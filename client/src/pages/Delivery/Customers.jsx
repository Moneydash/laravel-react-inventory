import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import {
    CancelOutlined,
    DeleteRounded,
    EditOutlined,
    EditRounded,
    GroupAddOutlined,
    PersonAddAltOutlined,
    PersonRemoveAlt1Outlined,
    RefreshOutlined
} from '@mui/icons-material';
import React, { useEffect, useState } from "react";
import { validate } from "email-validator";
import { axios_delete_header, axios_get_header, axios_post_header_file } from "utils/requests";
import { decryptAccessToken } from 'utils/auth';
import {
    get_Customers,
    get_Customer,
    update_Customer,
    add_Customer,
    get_Customer_types,
    get_Industry_types,
    remove_Customer
} from 'utils/services';
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import {
    apiGetHelper,
    crumbsHelper,
    nullCheck,
    phNumRegex,
    setData,
    setErrorHelper,
    validateTin } from "utils/helper";
import AddUpdateContent from "components/pages/Delivery/Customer/Add_Update";
import { toast } from "react-toastify";
import {
    ErrorColorBtn,
    ErrorColorIconBtn,
    ErrorColorLoadingBtn,
    PrimaryColorBtn,
    PrimaryColorIconBtn,
    PrimaryColorLoadingBtn
} from "components/elements/ButtonsComponent";
import TableComponentV2 from "components/elements/TableComponentV2";
import useDebounce from "hooks/useDebounce";

function Customers() {
    document.title = 'InventoryIQ: Delivery Hub - Customers';
    const decrypted_access_token = decryptAccessToken();
    const empty_field_warning = 'Please fill up required field!';

    const renderActionButtons = (params) => {
        return <>
            <PrimaryColorIconBtn
                fn={() => get_customer(1, params.value)}
                title="Update Customer Information"
                icon={<EditRounded fontSize="small"/> }
            />
            <ErrorColorIconBtn
                fn={() => get_customer(2, params.value)}
                title="Remove Customer"
                icon={<DeleteRounded fontSize="small"/>}
                sx={{ ml: 1 }}
            />
        </>
    };

    const columns = [
        { field: 'account_number', headerName: 'Account Number', flex: 1 },
        { field: 'firstname', headerName: 'First Name', flex: 1 },
        { field: 'lastname', headerName: 'Last Name', flex: 1 },
        { field: 'contact_number', headerName: 'Contact Number', flex: 1 },
        { field: 'email', headerName: 'E-mail Address', flex: 1 },
        {
            field: 'name',
            headerName: 'Customer Type',
            flex: 1,
            valueGetter: (params) => params.row.customer_type?.name || ''
        },
        { field: 'customer_location', headerName: 'Customer Location', flex: 1 },
        { field: 'billing_address', headerName: 'Billing Address', flex: 1 },
        { field: 'shipping_address', 'headerName': 'Shipping Address', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];

    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [removeDialog, setRemoveDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(0); // 0 = create, 1 = update
    const [customerTypes, setCustomerTypes] = useState([]);
    const [industryTypes, setIndustryTypes] = useState([]);
    const initialFormData = {
        id: '',
        firstname: '',
        middlename: '',
        lastname: '',
        contact_number: '',
        email: '',
        billing_address: '',
        shipping_address: '',
        customer_location: '',
        customer_type_id: '',
        tin: '',
        website: '',
        social_link: '',
        has_company: 0,
        industry_type_id: '',
        company_size: '',
        years: '',
        customer_notes: ''
    };
    const initialFormDataError = {  
        firstname: false,
        lastname: false,
        contact_number: false,
        email: false,
        customer_location: false,
        customer_type_id: false,
        billing_address: false,
        shipping_address: false,
        tin: false,
        years: false,
        industry_type_id: false,
        company_size: false
    };
    const initialFormDataHelperText = {
        firstname: '',
        lastname: '',
        contact_number: '',
        email: '',
        customer_location: '',
        billing_address: '',
        shipping_address: '',
        tin: '',
        years: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [formDataError, setFormDataError] = useState(initialFormDataError);
    const [formDataHelperText, setFormDataHelperText] = useState(initialFormDataHelperText);

    // table data tracking
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 300);

    const get_customers = () => {
        setRows([]);
        setTableLoading(true);

        axios_get_header(
            `${get_Customers}?page=1&per_page=10&search=`,
            decrypted_access_token
        )
        .then(response => {
            const data = response?.data;
            const customer = data?.data;
            setTableLoading(false);
            setRows(customer);
            setMaxPage(data?.last_page);
        })
        .catch(error => {
            setTableLoading(false);
            toast.error('Oops, something went wrong. Please try again later.');
            console.log(error);
        });

    };

    useEffect(() => {
        axios_get_header(
            `${get_Customers}?page=${currentPage}&per_page=${rowsPerPage}&search=${debounceSearch}`,
            decrypted_access_token
        )
        .then(response => {
            const data = response?.data;
            const customer = data?.data;
            setTableLoading(false);
            setRows(customer);
            setMaxPage(data?.last_page ?? null);
        })
        .catch(error => {
            setTableLoading(false);
            toast.error('Oops, something went wrong. Please try again later.');
            console.log(error);
        });
    }, [currentPage, rowsPerPage, debounceSearch, decrypted_access_token]);

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
    
    const get_types = () => {
        apiGetHelper(get_Customer_types, setCustomerTypes, 'customer_types');
    };

    const get_industries = () => {
        apiGetHelper(get_Industry_types, setIndustryTypes, 'industry_types');
    };

    const formDataReset = () => {
        setFormData(initialFormData);
        setFormDataError(initialFormDataError);
        setFormDataHelperText(initialFormDataHelperText);
        setCustomerTypes([]);
        setIndustryTypes([]);
    };

    const handleDialog = (open) => {
        setDialog(open);
        if (!open) {
            setEditIndex(0);
            formDataReset();
        } else {
            get_types();
            get_industries();
        }
    };
    
    const get_customer = async (editIndexValue, customer_id) => {
        const response = await axios_get_header(`${get_Customer}${customer_id}`, decrypted_access_token);
        const data = response.data;
        const customer = data.customer_data;
        setEditIndex(editIndexValue);

        if (editIndexValue === 1) {
            setFormData((prevState) => ({
                ...prevState,
                id: customer?.id,
                firstname: customer?.firstname,
                middlename: customer?.middlename ?? '',
                lastname: customer?.lastname,
                contact_number: customer?.contact_number,
                email: customer?.email,
                customer_location: customer?.customer_location,
                customer_type_id: customer?.customer_type_id,
                billing_address: customer?.billing_address,
                shipping_address: customer?.shipping_address,
                tin: customer?.tin,
                customer_notes: customer?.customer_notes,
                website: customer?.website ?? '',
                social_link: customer?.social_link ?? '',
                has_company: customer?.has_company === true ? 1 : 0,
                industry_type_id: nullCheck(customer?.company_info) ? '' : customer?.company_info?.industry_type_id,
                company_size: nullCheck(customer?.company_info) ? '' : customer?.company_info?.company_size,
                years: nullCheck(customer?.company_info) ? '' : customer?.company_info?.years_of_operation,
            }));
            handleDialog(true);
        } else if (editIndexValue === 2) {
            setData(setFormData, 'id', customer?.id);
            handleRemoveDialog(true);
        }
    };

    const handleRemoveDialog = (open) => {
        setRemoveDialog(open);
        if (open === false) {
            formDataReset();
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'email':
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (!validate(value)) {
                    setErrorHelper(name, true, 'Please enter a valid email address.', setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'firstname':
            case 'lastname':
            case 'customer_location':
            case 'billing_address':
            case 'shipping_address':
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (value.length < 2) {
                    setErrorHelper(
                        name,
                        true,
                        'Please enter a valid value with atleast 2 characters',
                        setFormDataError,
                        setFormDataHelperText
                    );
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'industry_type_id':
            case 'company_size':
            case 'years':
            case 'customer_type_id':
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'tin':
                setData(setFormData, name, value);
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (!validateTin(value)) {
                    setErrorHelper(name, true, 'Not a valid TIN', setFormDataError, setFormDataHelperText);
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
            default:
                setData(setFormData, name, value);
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let hasErrorGeneral = false;
        let hasErrorCompany = false;
        let hasCompanyError = formData?.has_company === 1
        && (
            nullCheck(formData?.industry_type_id)
            || nullCheck(formData?.company_size)
            || nullCheck(formData?.years)
        );
        const optional = ["middlename", "customer_notes", "website", "social_link", "id"];
        const companyFields = ["industry_type_id", "company_size", "years"];
        const isCompany = formData?.has_company === 1;

        for (const field in formDataError) {
            const isEmptyField = nullCheck(formData[field]);
            const isFieldError = formDataError[field] === true;
            const isOptional = optional.includes(field);
            const isCompanyField = companyFields.includes(field);

            if (editIndex === 1) {
                if (isFieldError && !isOptional && isCompanyField) {
                    setErrorHelper(field, true, 'Field Error!', setFormDataError, setFormDataHelperText);
                    hasErrorGeneral = true;
                    if (isCompany && isCompanyField && (isEmptyField || isFieldError)) {
                        setErrorHelper(field, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                        hasErrorCompany = true;
                    }
                }
            } else if (editIndex === 0) {
                if ((isEmptyField || isFieldError) && !isOptional && !isCompanyField) {
                    setErrorHelper(field, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                    hasErrorGeneral = true;
                    if (isCompany && isCompanyField && (isEmptyField || isFieldError)) {
                        setErrorHelper(field, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                        hasErrorCompany = true;
                    }
                }
            }
        }

        if (hasErrorGeneral || hasErrorCompany) {
            toast.error('Oops, something went wrong. Please check for incorrect or empty fields!');
        } else if (hasCompanyError) {
            toast.error("Empty fields on company information must be filled up.");
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_post_header_file(`${update_Customer}${formData?.id}`, formData, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    get_customers();
                    toast.success(response?.data?.message ?? 'Success');
                })
                .catch(error => {
                    setLoading(false);
                    console.log(error);
                });
            } else if (editIndex === 0) {
                axios_post_header_file(add_Customer, formData, decrypted_access_token)
                .then(response => {
                    setLoading(false);
                    handleDialog(false);
                    get_customers();
                    toast.success(response?.data?.message ?? 'Success');
                }).catch(error => {
                    setLoading(false);
                    console.log(error);
                    toast.error("Oops, something went wrong. Please try again later.");
                });
            }
        }
    };

    const handleRemoveSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios_delete_header(`${remove_Customer}${formData?.id}`, {}, decrypted_access_token)
        .then(response => {
            setLoading(false);
            handleRemoveDialog(false);
            get_customers();
            toast.success(response?.data?.message ?? 'Success');
        })
        .catch(error => {
            setLoading(false);
            console.error('Remove error: ', error);
            toast.error("Oops, something went wrong. Please try again later.");
        })
    };

    return (
        <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{ px: 2, mt: 3 }} display="flex">

            {/* create and update dialog */}
            <Dialog open={dialog} fullWidth maxWidth="lg">
                <DialogTitle>{editIndex === 1 ? 'Update' : 'Add New'} Customer</DialogTitle>
                <Divider sx={{ mt: -1.5 }}>
                    <Typography variant="body1">Primary Information</Typography>
                </Divider>
                <DialogContent>
                    <AddUpdateContent
                        formData={formData}
                        formDataError={formDataError}
                        formDataHelperText={formDataHelperText}
                        handleChange={handleChange}
                        customerTypes={customerTypes}
                        industryTypes={industryTypes}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mr: 2, mb: 1.5 }}>
                        <Grid item>
                            <ErrorColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined fontSize="small"/>}
                                onClick={() => handleDialog(false)}
                            />
                        </Grid>
                        {editIndex !== 2 && (
                            <Grid item>
                                <PrimaryColorLoadingBtn
                                    displayText={loading && editIndex === 1
                                        ? 'Updating Customer'
                                        : (loading && editIndex === 0
                                        ? 'Adding New Customer'
                                        : (!loading && editIndex === 1
                                        ? 'Update Customer'
                                        : (!loading && editIndex === 0
                                        ? 'Add New Customer'
                                        : '')))
                                    }
                                    endIcon={editIndex === 1
                                        ? <EditOutlined fontSize="small"/>
                                        : <PersonAddAltOutlined fontSize="small"/>
                                    }
                                    loading={loading}
                                    onClick={handleSubmit}
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* remove dialog */}
            <Dialog open={removeDialog} onClose={() => handleRemoveDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Remove Customer?</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">
                        Are you sure you want to remove this customer?
                    </Typography>
                    <br />
                    <Typography variant="body1">
                        <span style={{ color: 'red' }}>NOTE:</span> CONTACT YOUR ADMINISTRATOR IF YOU WANT TO RESTORE THIS CUSTOMER.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" justifyContent="flex-end" columnSpacing={{ lg: 1.5, xl: 1.5 }} sx={{ mb: 1, mr: 1.5 }}>
                        <Grid item>
                            <PrimaryColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined fontSize="small"/>}
                                onClick={() => handleRemoveDialog(false)}
                            />
                        </Grid>
                        <Grid item>
                            <ErrorColorLoadingBtn
                                displayText={loading ? 'Removing Customer' : 'Remove Customer'}
                                endIcon={<PersonRemoveAlt1Outlined fontSize="small"/>}
                                onClick={handleRemoveSubmit}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* buttons */}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={crumbsHelper('Customers', 'Delivery', '../delivery')}/>
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <Button variant="contained" color="primary" endIcon={<RefreshOutlined />} onClick={get_customers}>Refresh Table</Button>
                        </Grid>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <Button variant="contained" color="primary" endIcon={<GroupAddOutlined />} onClick={() => handleDialog(true)}>Add New Customer</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* table definitions */}
            <TableComponentV2
                columns={columns}
                rows={rows}
                loadingTable={tableLoading}
                sx={{ mb: 5 }}
                size={rowsPerPage}
                handleSizeChange={handleSizeChange}
                search={search}
                handleSearch={handleSearch}
                page={currentPage}
                handlePageChange={handlePageChange}
                total={maxPage}
            />
        </Grid>
    );
}

export default Customers;