import { CancelOutlined, DeleteRounded, DomainAddOutlined, DownloadRounded, EditRounded, RefreshOutlined } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { ErrorColorBtn, PrimaryColorBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import TableComponent from "components/elements/TableComponent";
import ToastCmp from "components/elements/ToastComponent";
import dayjs from "dayjs";
import { validate } from "email-validator";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { decryptAccessToken } from "utils/auth";
import { inventoryCrumbs } from "utils/breadCrumbs";
import { axios_delete_header, axios_get_header, axios_post_header_file } from "utils/requests";
import {
    get_Warehouse_types,
    get_Categories,
    get_Equipments,
    add_Warehouse,
    get_Warehouses,
    get_Warehouse,
    update_Warehouse,
    remove_Warehouse,
    download_File
} from 'utils/services';
import {
    apiGetHelper,
    fileNameSplit,
    setErrorHelper
} from "utils/helper";
import AddUpdateContent from "components/pages/Inventory/Warehouse/Add_Update";
import Remove from "components/pages/Inventory/Warehouse/Remove";

function Warehouse() {
    document.title = 'Inventory IQ: Warehouse Management';
    const decrypt_access_token = decryptAccessToken();
    const try_again = 'Oops, something went wrong. Please try again later.';

    const renderActionButtons = (params) => {
        return [
            <GridActionsCellItem
                icon={<EditRounded fontSize="small" color="primary" />}
                label="Update Warehouse"
                onClick={() => get_warehouse(params.id, 1)}
                showInMenu
            />,
            <GridActionsCellItem
                icon={<DeleteRounded fontSize="small" color="error" />}
                label="Remove Warehouse"
                onClick={() => get_warehouse(params.id, 0)}
                showInMenu
            />,
            <GridActionsCellItem
                icon={<DownloadRounded fontSize="small" color="info" />}
                label="Download Insurance Info"
                onClick={() => download(params.id, 'insurance')}
                showInMenu
            />,
            <GridActionsCellItem
                icon={<DownloadRounded fontSize="small" color="info" />}
                label="Download Certifications"
                onClick={() => download(params.id, 'certifications')}
                showInMenu
            />,
            <GridActionsCellItem
                icon={<DownloadRounded fontSize="small" color="info" />}
                label="Download Vendor Contracts"
                onClick={() => download(params.id, 'contract')}
                showInMenu
            />
        ];
    }

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
        { field: 'id', headerName: 'Action', flex: 1, type: 'actions', getActions: renderActionButtons}
    ];

    const initialForm = {
        id: '',
        name: '',
        location: '',
        contact_person: '',
        person_conno: '',
        email: '',
        hotline: '',
        warehouseType_id: '',
        equipments: [],
        categories: [],
        opening_hrs: dayjs(),
        closing_hrs: dayjs(),
        landmark: '',
        description: '',
        size_area: '',
        insurance_info: '',
        insurance_info_name: '',
        certifications_compliance: '',
        certifications_compliance_name: '',
        usage: '',
        is_biohazard: '',
        precautionary_measure: '',
        maintenance_schedule: '',
        vendor_contracts: '',
        vendor_contracts_name: '',
        min_temp: '',
        max_temp: '',
        special_handling_info: '',
        facebook_link: '',
        twitter_link: ''
    };

    const initialError = {
        name: false,
        location: false,
        contact_person: false,
        person_conno: false,
        email: false,
        hotline: false,
        warehouseType_id: false,
        equipment: false,
        category: false,
        opening_hrs: false,
        closing_hrs: false,
        landmark: false,
        size_area: false,
        insurance_info_name: false,
        certifications_compliance_name: false,
        usage: false,
        is_biohazard: false,
        precautionary_measure: false,
        maintenance_schedule: false,
        vendor_contracts_name: false,
    };

    const initialHelperText = {
        name: '',
        location: '',
        contact_person: '',
        person_conno: '',
        email: '',
        hotline: '',
        opening_hrs: '',
        closing_hrs: '',
        landmark: '',
        description: '',
        size_area: '',
        insurance_info_name: '',
        certifications_compliance_name: '',
        usage: '',
        precautionary_measure: '',
        maintenance_schedule: '',
        vendor_contracts_name: '',
    };

    const optional = [
        'id',
        'description',
        'min_temp',
        'max_temp',
        'facebook_link',
        'twitter_link',
        'special_handling_info'
    ];

    const [rows, setRows] = useState([]);
    const [loadingTable, setLoadingTable] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [warehouseTypes, setWarehouseTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(0);
    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState(initialError);
    const [formHelper, setFormHelper] = useState(initialHelperText);
    const [removeDialog, setRemoveDialog] = useState(false);

    const get_warehouses = () => {
        setRows([]);
        setLoadingTable(true);
        axios_get_header(get_Warehouses, decrypt_access_token)
        .then(response => {
            const data = response.data;
            const rowData = data.warehouses;
            const transformData = rowData.map(row => {
                return {
                    id: row?.id ?? '',
                    name: row?.name ?? '',
                    type: row?.warehouse_type?.name ?? '',
                    contact_person: row?.contact_person ?? '',
                    person_conno: row?.person_conno ?? '',
                    email: row?.email ?? '',
                    hotline: row?.hotline ?? '',
                    location: row?.location ?? '',
                    landmark: row?.landmark ?? '',
                    description: row?.description ?? ''
                };
            });
            setRows(transformData);
            setLoadingTable(false);
        })
        .catch(error => {
            console.error('Fetch Error: ', error);
            toast.error(try_again);
        });
    }

    /* eslint-disable */
    useEffect(() => {
        get_warehouses();
    }, []);
    /* eslint-disable */

    const get_warehouse_types = async () => {
        axios_get_header(get_Warehouse_types, decrypt_access_token)
        .then(response => {
            setWarehouseTypes(response.data.types);
        }).catch(error => {
            console.error('Error: ', error);
            toast.error(try_again);
        });
    }

    const get_categories = async () => {
        apiGetHelper(get_Categories, setCategories, 'categories');
    };

    const get_equipments = async () => {
        axios_get_header(get_Equipments, decrypt_access_token)
        .then(response => {
            const data = response.data;
            setEquipments(data.equipments);
        })
        .catch(error => {
            console.error('Error: ', error);
            toast.error(try_again);
        });
    };

    const handleDialog = (open) => {
        if (open === false) {
            setWarehouseTypes([]);
            setCategories([]);
            setEquipments([]);
            setForm(initialForm);
            setFormError(initialError);
            setFormHelper(initialHelperText);
            setEditIndex(0);
        } else {
            get_warehouse_types();
            get_categories();
            get_equipments();
        }
        setDialog(open);
    }

    const get_warehouse = async (id, editIndexVal) => {
        try {
            const response = await axios_get_header(`${get_Warehouse}${id}`, decrypt_access_token);
            const data = response.data;
            const warehouse_data = data.warehouse;
            const currentDate = dayjs().format('YYYY-MM-DD');

            if (editIndexVal === 1) {
                setEditIndex(editIndexVal);
                setForm((prevState) => ({
                    ...prevState,
                    id: warehouse_data?.id ?? '',
                    name: warehouse_data?.name ?? '',
                    location: warehouse_data?.location ?? '',
                    contact_person: warehouse_data?.contact_person ?? '',
                    person_conno: warehouse_data?.person_conno ?? '',
                    email: warehouse_data?.email ?? '',
                    hotline: warehouse_data?.hotline ?? '',
                    warehouseType_id: warehouse_data?.warehouseType_id ?? '',
                    equipments: warehouse_data.equipment.map(equipment => equipment?.id) ?? '',
                    categories: warehouse_data.category.map(cat => cat?.id) ?? '',
                    opening_hrs: dayjs(`${currentDate}T${warehouse_data?.opening_hrs}`), // add the current date, to format the time
                    closing_hrs: dayjs(`${currentDate}T${warehouse_data?.closing_hrs}`),
                    landmark: warehouse_data?.landmark ?? '',
                    description: warehouse_data?.description ?? '',
                    size_area: warehouse_data?.size_area ?? '',
                    insurance_info_name: fileNameSplit(warehouse_data?.insurance_info) ?? '',
                    certifications_compliance_name: fileNameSplit(warehouse_data?.certifications_compliance) ?? '',
                    usage: warehouse_data?.usage ?? '',
                    is_biohazard: warehouse_data.is_biohazard !== undefined && warehouse_data.is_biohazard === false ? 2 : 1,
                    precautionary_measure: warehouse_data?.precautionary_measure ?? '',
                    maintenance_schedule: warehouse_data?.maintenance_schedule ?? '',
                    vendor_contracts_name: fileNameSplit(warehouse_data?.vendor_contracts) ?? '',
                    min_temp: warehouse_data?.min_temp ?? '',
                    max_temp: warehouse_data?.max_temp ?? '',
                    special_handling_info: warehouse_data?.special_handling_info ?? '',
                    facebook_link: warehouse_data?.facebook_link ?? '',
                    twitter_link: warehouse_data?.twitter_link ?? ''
                }));
                handleDialog(true);
            } else {
                setForm((prevState) => ({
                    ...prevState,
                    id: warehouse_data?.id ?? ''
                }));
                setRemoveDialog(true);
            }
        } catch (error) {
            console.error('Error: ', error);
            toast.error(try_again);
        }
    };

    // handling the validation and field changes ===== start
    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name !== 'insurance_info' || name !== 'certifications_compliance' || name !== 'vendor_contracts') {
            setForm((prevState) => ({ ...prevState, [name]: value }));
            for (const field in optional) {
                if (name !== field) {
                    if (value === '') {
                        setErrorHelper(name, true, 'Please fill up required field!', setFormError, setFormHelper);
                    } else {
                        setErrorHelper(name, false, '', setFormError, setFormHelper);
                    }   
                }
            }
        }

        if (name === 'email') {
            const is_validEmail = validate(value);
            if (value === '') {
                setErrorHelper(name, true, 'Please fill up required field!', setFormError, setFormHelper);
            } else if (!is_validEmail) {
                setErrorHelper(name, true, 'Invalid E-mail format!', setFormError, setFormHelper);
            } else {
                setErrorHelper(name, false, '', setFormError, setFormHelper);
            }
        }

        if (name === 'is_biohazard') {
            if (value === 2) {
                setErrorHelper('precautionary_measure', false, '', setFormError, setFormHelper);
                if (form.precautionary_measure !== '') {
                    setForm((prevState) => ({ ...prevState, precautionary_measure: '' }));
                }
            } else if (value === 1 && form.precautionary_measure === '') {
                setErrorHelper('precautionary_measure', true, 'Please fill up required field!', setFormError, setFormHelper);
            }
        }

        if (name === 'person_conno') {
            const ph_mobile_regex = /^(09|\+639)\d{9}$/;
            if (value === '') {
                setErrorHelper(name, true, 'Please fill up required field!', setFormError, setFormHelper);
            } else if (!ph_mobile_regex.test(value)) {
                setErrorHelper(name, true, 'Please enter a valid Philippine mobile number. It should start with \'09\' or \'+639\' followed by 9 digits.', setFormError, setFormHelper);
            } else {
                setErrorHelper(name, false, '', setFormError, setFormHelper);
            }
        }

        if (name === 'insurance_info' || name === 'certifications_compliance' || name === 'vendor_contracts') {
            const file = files[0];

            if (file) {
                const filereader = new FileReader();
                filereader.readAsDataURL(file);
                if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
                    if (file.size <= parseInt((5 * 1024) * 1024)) {
                        filereader.onloadend = function(e) {
                            setForm((prevState) => ({ ...prevState, [name]: file, [`${name}_name`]: file.name }));
                            setErrorHelper(`${name}_name`, false, '', setFormError, setFormHelper);
                        };
                    } else {
                        setForm((prevState) => ({ ...prevState, [name]: '', [`${name}_name`]: '' }));
                        setErrorHelper(`${name}_name`, true, 'File size limit is 5MB, please select another file.', setFormError, setFormHelper);
                        toast.error('File size limit is only 5MB');
                    }
                } else {
                    setForm((prevState) => ({ ...prevState, [name]: '', [`${name}_name`]: '' }));
                    setErrorHelper(`${name}_name`, true, 'Please select a valid file (pdf, doc, docx)', setFormError, setFormHelper);
                    toast.error('.pdf, .doc or .docx file are only allowed');
                }
            }
        }
    };

    const handleOpeningHrs = (time) => {
        const formattedTime = time ? dayjs(time) : '';
        setForm((prevState) => ({ ...prevState, opening_hrs: formattedTime }));

        if (!formattedTime) {
            setErrorHelper('opening_hrs', true, 'Please fill up required field!', setFormError, setFormHelper);
        } else {
            setErrorHelper('opening_hrs', false, '', setFormError, setFormHelper);
        }
    };

    const handleClosingHrs = (time) => {
        const formattedTime = time ? dayjs(time) : '';
        setForm((prevState) => ({ ...prevState, closing_hrs: formattedTime }));

        if (!formattedTime) {
            setErrorHelper('closing_hrs', true, 'Please fill up required field!', setFormError, setFormHelper);
        } else {
            setErrorHelper('closing_hrs', false, '', setFormError, setFormHelper);
        }
    };
    // handling the validation and field changes ===== end

    const handleSubmit = async () => {
        const formDataSubmit = new FormData();
        const optional_update = ['insurance_info', 'certifications_compliance', 'vendor_contracts'];
        const excluded_fields = ['id', 'insurance_info_name', 'certifications_compliance_name', 'vendor_contracts_name'];

        for (const field in form) {
            if (!excluded_fields.includes(field)) {
                if (field === 'opening_hrs' || field === 'closing_hrs') {
                    const formattedTime = dayjs(form[field]).format('HH:mm');
                    formDataSubmit.append(field, formattedTime);
                } else if (field === 'is_biohazard') {
                    formDataSubmit.append(field, form[field] === 1 ? 1 : 0);
                } else {
                    formDataSubmit.append(field, form[field]);
                }
            }
        }

        let hasError = false;
        const isBioError = form?.is_biohazard === 1 && form?.precautionary_measure === '';

        for (const field in form) {
            const isFieldEmpty = form[field] === '';
            const isFieldError = formError[field] === true;
        
            if (editIndex === 1) {
                if (isBioError) {
                    hasError = true;
                    setErrorHelper('precautionary_measure', true, 'Please fill up required fields!', setFormError, setFormHelper);
                } else if (!optional.includes(field) && !optional_update.includes(field) && isFieldError) {
                    hasError = true;
                    setErrorHelper(field, true, 'Please fill up required fields!', setFormError, setFormHelper);
                }
            } else if (editIndex === 0) {
                if (!optional.includes(field) && (isFieldEmpty && isFieldError) ) {
                    hasError = true;
                    console.log('Validation: ', true);
                    setErrorHelper(field, true, 'Please fill up required field!', setFormError, setFormHelper);
                    setErrorHelper('precautionary_measure', false, '', setFormError, setFormHelper);
                } else if (isBioError) {
                    hasError = true;
                    console.log('Is Bio Error?: ', isBioError);
                    setErrorHelper('precautionary_measure', true, 'Please fill up required field!', setFormError, setFormHelper);
                }
            }
        }

        if (hasError) {
            toast.error('Please check for empty or error fields.');
        } else if (form.is_biohazard === 1 && form.precautionary_measure === '') {
            toast.error('You must precautionary measure if it\'s Biohazard');
            setFormError((prevError) => ({ ...prevError, precautionary_measure: true }));
            setFormHelper((prevText) => ({ ...prevText, precautionary_measure: 'Please fill up required field!' }));
        } else if (form.equipments?.length <= 0) {
            toast.error('You must have at least one equipment on your warehouse.');
        } else if (form.categories?.length <= 0) {
            toast.error('You must have at least one suitable categories for your warehouse.');
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_post_header_file(update_Warehouse + form?.id, formDataSubmit, decrypt_access_token)
                .then(response => {
                    setLoading(false);
                    const data = response.data;
                    toast.success(data.message);
                    get_warehouses();
                    handleDialog(false);
                })
                .catch(error => {
                    console.error('Error: ', error);
                    setLoading(false);
                    toast.error(try_again);
                });
            } else {
                axios_post_header_file(add_Warehouse, formDataSubmit, decrypt_access_token)
                .then(response => {
                    setLoading(false);
                    const data = response.data;
                    toast.success(data.message);
                    get_warehouses();
                    handleDialog(false);
                })
                .catch(error => {
                    setLoading(false);
                    console.error('Error: ', error);
                    toast.error(try_again);
                });
            }
        }
    }

    const handleRemove = async () => {
        setLoading(true);
        axios_delete_header(`${remove_Warehouse}${form.id}`, {}, decrypt_access_token)
        .then(response => {
            setLoading(false);
            toast.success(response.data.message);
            get_warehouses();
            setRemoveDialog(false);
            setForm(initialForm);
        })
        .catch(error => {
            console.error('Removing Error: ', error);
            toast.error(try_again);
            setLoading(false);
        });
    }

    const download = async (id, type) => {
        try {
            window.open(`${download_File}${type}/${id}`);
        } catch (error) {
            toast.error(try_again);
        }   
    };

    return(
        <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{ px: 2, mt: 3 }} display="flex">
            {/* toast or alert or snackbar component */}
            <ToastCmp />

            {/* dialog for adding and updating of warehouses */}
            <Dialog open={dialog} fullWidth maxWidth="lg">
                <DialogTitle>
                    { editIndex === 1 ? 'Update Warehouse' : 'New Warehouse' }
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <AddUpdateContent
                        form={form}
                        formError={formError}
                        formHelper={formHelper}
                        handleChange={handleChange}
                        categories={categories}
                        equipments={equipments}
                        warehouseTypes={warehouseTypes}
                        handleOpeningHrs={handleOpeningHrs}
                        handleClosingHrs={handleClosingHrs}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                displayText={loading && editIndex === 1 ? 'Updating Warehouse'
                                : (loading && editIndex === 0 ? 'Adding New Warehouse'
                                : (editIndex === 1 && !loading ? 'Update Warehouse'
                                : 'Add New Warehouse'))
                                }
                                endIcon={<DomainAddOutlined />}
                                loading={loading}
                                onClick={handleSubmit}
                            />
                        </Grid>
                        <Grid item>
                            <ErrorColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined />}
                                onClick={() => handleDialog(false)}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* dialog for removing warehouse */}
            <Remove
                removeDialog={removeDialog}
                handleRemove={handleRemove}
                setRemoveDialog={setRemoveDialog}
                loading={loading}
            />

            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={ inventoryCrumbs('Warehouse') } />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="flex-end" alignItems="center">
                            <PrimaryColorBtn endIcon={<RefreshOutlined fontSize="small" />} displayText="Refresh Table" onClick={get_warehouses} />
                        </Grid>
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