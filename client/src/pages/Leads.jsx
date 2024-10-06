import { CancelOutlined, EditRounded, PersonAddAlt1Outlined, RefreshOutlined } from "@mui/icons-material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid } from "@mui/material";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { ErrorColorBtn, PrimaryColorBtn, PrimaryColorIconBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import TableComponentV3 from "components/elements/Tables/TableComponentV3";
import AddUpdateContent from "components/pages/Leads/Add_Update";
import { validate } from "email-validator";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createItemRequest, fetchItemsRequest, updateItemRequest } from "store/actions";
import {
    apiGetHelper,
    crumbsHelper,
    isoDateToCommonDateTime,
    nullCheck, phNumRegex,
    setData,
    setErrorHelper,
    setErrorOnly
} from "utils/helper";
import {
    get_Lead_sources,
    get_Industry_types,
    get_Lead_job_roles,
    add_Lead,
    get_Leads,
    get_Lead,
    update_Lead
} from 'utils/services';

function Leads() {
    document.title = "InventoryIQ: Sales Leads";
    const dispatch = useDispatch();
    const currentPage = useSelector((state) => state.itemReducer.currentPage);
    const perPage = useSelector((state) => state.itemReducer.perPage);
    const search = useSelector((state) => state.itemReducer.search);
    const loading = useSelector((state) => state.itemReducer.loading);

    const renderActionButtons = params => {
        return (
            <PrimaryColorIconBtn
                title="Update Lead"
                icon={<EditRounded fontSize="small"/>}
                fn={() => get_lead(params.value)}
            />
        )
    }
    const columns = [
        { field: 'firstname', headerName: 'First Name', flex: 1 },
        { field: 'lastname', headerName: 'Last Name', flex: 1 },
        { field: 'email', headerName: 'E-mail', flex: 1 },
        { field: 'contact_num', headerName: 'Contact Number', flex: 1 },
        { field: 'lead_owner', headerName: 'Owner', flex: 1 },
        { field: 'company_name', headerName: 'Company Name', flex: 1 },
        {
            field: 'lead_source_id',
            headerName: 'Lead Source',
            flex: 1,
            valueGetter: (params) => params.row.lead_source.name
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            flex: 1,
            valueGetter: (params) => isoDateToCommonDateTime(params.row.created_at)
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            flex: 1,
            valueGetter: (params) => isoDateToCommonDateTime(params.row.updated_at)
        },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [leadSources, setLeadSources] = useState([]);
    const [industryTypes, setIndustryTypes] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [editIndex, setEditIndex] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const initialForm = {
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        contact_num: '',
        lead_owner: '',
        lead_source_id: '',
        company_name: '',
        industry_type_id: '',
        job_title_id: '',
        lead_status: '',
        notes: '',
        website: '',
        interests: '',
        campaign: ''
    };
    const initialFormError = {
        firstname: false,
        lastname: false,
        email: false,
        contact_num: false,
        lead_owner: false,
        lead_source_id: false,
        industry_type_id: false,
        job_title_id: false,
        lead_status: false
    };
    const initialFormHelper = {
        firstname: '',
        lastname: '',
        email: '',
        contact_num: '',
        lead_owner: '',
        lead_status: '',
    };

    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState(initialFormError);
    const [formHelper, setFormHelper] = useState(initialFormHelper);

    const get_sources = () => {
        apiGetHelper(get_Lead_sources, setLeadSources, 'lead_sources');
    };

    const get_industries = () => {
        apiGetHelper(get_Industry_types, setIndustryTypes, 'industry_types');
    };

    const get_job_roles = () => {
        apiGetHelper(get_Lead_job_roles, setJobRoles, 'lead_roles');
    };

    const handleChange = (evt) => {
        const { name, value } = evt.target;

        setData(setForm, name, value);
        switch (name) {
            case 'firstname':
            case 'lastname':
            case 'lead_owner':
                if (nullCheck(value)) {
                    setErrorHelper(name, true, 'This field is required!', setFormError, setFormHelper);
                } else {
                    setErrorHelper(name, false, '', setFormError, setFormHelper);
                }
                break;
            case 'email':
                if (nullCheck(value)) {
                    setErrorHelper(name, true, 'This field is required!', setFormError, setFormHelper);
                } else if (!validate(value)) {
                    setErrorHelper(name, true, 'E-mail is invalid', setFormError, setFormHelper);
                } else {
                    setErrorHelper(name, false, '', setFormError, setFormHelper);
                }
                break;
            case 'contact_num':
                if (nullCheck(value)) {
                    setErrorHelper(name, true, 'This field is required!', setFormError, setFormHelper);
                } else if (!phNumRegex(value)) {
                    setErrorHelper(
                        name,
                        true,
                        'Please enter a valid Philippine mobile number. It should start with \'09\' or \'+639\' followed by 9 digits.',
                        setFormError,
                        setFormHelper
                    );
                } else {
                    setErrorHelper(name, false, '', setFormError, setFormHelper);
                }
                break;
            case 'lead_source_id':
            case 'industry_type_id':
            case 'job_title_id':
            case 'lead_status':
                if (nullCheck(value)) {
                    setErrorOnly(setFormError, name, true);
                } else {
                    setErrorOnly(setFormError, name, false);
                }
                break;
            default:
                break;
        }
    }

    const refresh = () => {
        const query = `?page=${currentPage}&per_page=${perPage}&search=${search}`;
        dispatch(fetchItemsRequest(`${get_Leads}${query}`, 'leads'));
    }

    const handleOpen = open => {
        setIsOpen(open);
        if (open) {
            get_sources();
            get_industries();
            get_job_roles();
        } else {
            setLeadSources([]);
            setIndustryTypes([]);
            setJobRoles([]);
            setForm(initialForm);
            setFormError(initialFormError);
            setFormHelper(initialFormHelper);
            setEditIndex(false);
            refresh();
        }
    };
    
    /* eslint-disable */
    useEffect(() => {
        if (!loading && submitting) {
            handleOpen(false);
            setSubmitting(false);
        }
    }, [loading, submitting]);
    /* eslint-disable */
    
    const get_lead = id => {
        setEditIndex(true);
        apiGetHelper(`${get_Lead}${id}`, setForm, 'lead');
        handleOpen(true);
    }

    const handleSubmit = event => {
        event.preventDefault();
    
        // Use some() to check if any field has an error or is empty
        const hasError = Object.keys(formError).some(
            (field) => formError[field] || nullCheck(form[field])
        );
    
        if (hasError) {
            toast.error("Please check any incorrect or empty required fields.");
            return;
        }

        setSubmitting(true);    
        const action = editIndex
            ? updateItemRequest(form, update_Lead, 'leads')
            : createItemRequest(form, add_Lead, 'leads');

        dispatch(action);
    };

    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 3 }} display="flex">
            <Dialog open={isOpen} fullWidth maxWidth="md">
                <DialogTitle>
                    Add New Lead
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <AddUpdateContent
                        data={form}
                        errors={formError}
                        helpers={formHelper}
                        leadSources={leadSources}
                        industryTypes={industryTypes}
                        jobRoles={jobRoles}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" columnSpacing={{ lg: 1, xl: 1 }} sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                displayText={
                                    loading && editIndex ? "Updating Lead"
                                    : (!loading && editIndex ? "Update Lead"
                                        : (!loading && !editIndex ? "Add Lead"
                                            : (loading && !editIndex ? "Adding Lead"
                                                : ""
                                            )
                                        )
                                    )
                                }
                                endIcon={<PersonAddAlt1Outlined fontSize="small"/>}
                                loading={loading}
                                onClick={handleSubmit}
                            />
                        </Grid>
                        <Grid item>
                            <ErrorColorBtn
                                displayText="Cancel"
                                endIcon={<CancelOutlined fontSize="small"/>}
                                onClick={() => handleOpen(false)}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={crumbsHelper('', 'Sales Leads', '')} />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="end" display="flex">
                            <PrimaryColorBtn displayText="Refresh Table" endIcon={<RefreshOutlined fontSize="small"/>} onClick={refresh} />
                        </Grid>
                        <Grid item justifyContent="end" display="flex">
                            <PrimaryColorBtn displayText="Add New Leads" endIcon={<PersonAddAlt1Outlined fontSize="small"/>} onClick={() => handleOpen(true)} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <TableComponentV3
                columns={columns}
                url={get_Leads}
                entity="leads"
                sx={{ mb: 5 }}
            />
        </Grid>
    );
}

export default Leads;