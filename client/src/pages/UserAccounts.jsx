import { CancelOutlined, CancelRounded, CloseRounded, Delete, DeleteRounded, EditRounded, GroupAddOutlined, PersonAddAlt1Outlined, PersonOffRounded, RefreshOutlined } from "@mui/icons-material";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import React, { Fragment, useEffect, useState } from "react";
import { axios_delete_header, axios_get_header, axios_patch_header, axios_post_header, axios_put_header } from '../utils/requests';
import * as EmailValidator from 'email-validator';
import { decryptAccessToken, decryptAuthId } from 'utils/auth';
import {
    get_Users,
    get_Roles,
    update_User,
    create_User,
    disable_User,
    get_Account_info
} from 'utils/services';
import { crumbsHelper, isoDateToCommonDateTime, nullCheck, setData, setErrorHelper } from "utils/helper";
import BreadCrumbsCmp from "components/elements/BreadcrumbsComponent";
import { toast } from "react-toastify";
import { ErrorColorBtn, ErrorColorLoadingBtn, PrimaryColorBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";
import TableComponentV2 from "components/elements/TableComponentV2";
import useDebounce from "hooks/useDebounce";

function UserAccounts() {
    document.title = 'InventoryIQ: User Accounts';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_auth_id = decryptAuthId();
    const empty_field_warning = "Please fill up required field!";

    const renderActionButtons = (params) => {
        return(
            <div>
                <IconButton onClick={() => get_user(1, params.value)} color="primary" sx={{ ml: 1 }} disabled={params.value === decrypted_auth_id}>
                    <Tooltip title="Update User Role" placement="bottom" arrow><EditRounded fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => get_user(2, params.value)} color="error" sx={{ ml: 1 }} disabled={params.value === decrypted_auth_id}>
                    <Tooltip title="Disable User Account" placement="bottom" arrow><DeleteRounded fontSize="small"/></Tooltip>
                </IconButton>
            </div>
        );
    }

    const columns = [
        { field: 'email', headerName: 'Email Address', flex: 1 },
        { field: 'username', headerName: 'Username', flex: 1 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            valueGetter: (params) => params.row?.roles[0]?.role_name
        },
        {
            field: 'status',
            headerName: 'User Status',
            flex: 1,
            valueGetter: (params) => nullCheck(params.row?.deleted_at) ? 'Active' : 'Inactive'
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            flex: 1,
            valueGetter: (params) => params.row?.created_at ? isoDateToCommonDateTime(params.row.created_at) : ''
        },
        {
            field: 'updated_at',
            headerName: 'Updated At',
            flex: 1,
            valueGetter: (params) => params.row?.updated_at ? isoDateToCommonDateTime(params.row.updated_at) : ''
        },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];

    const [rows, setRows] = useState([]);
    const [editIndex, setEditIndex] = useState(0);
    const [dialog, setDialog] = useState(false);
    const [disableDialog, setDisableDialog] = useState(false);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        username: '',
        role: ''
    });
    const [formDataError, setFormDataError] = useState({
        email: false,
        username: false,
        role: false
    });
    const [formDataHelperText, setFormDataHelperText] = useState({
        email: '',
        username: ''
    });

    // pagination
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [search, setSearch] = useState('');
    const debounceSearch = useDebounce(search, 300);

    const get_users = () => {
        setTableLoading(true);
        axios_get_header(
            `${get_Users}?page=1&per_page=10&search=`,
            decrypted_access_token
        )
        .then(response => {
            const data = response.data.users_list;
            setTableLoading(false);
            setRows(data.data);
            setMaxPage(data.last_page);
        })
        .catch(error => {
            setTableLoading(false);
            console.error('Error: ', error);
        });
    }
    
    /* eslint-disable */
    useEffect(() => {
        setTableLoading(true);
        axios_get_header(
            `${get_Users}?page=${currentPage}&per_page=${rowsPerPage}&search=${debounceSearch}`,
            decrypted_access_token
        )
        .then(response => {
            const data = response.data.users_list;
            setTableLoading(false);
            setRows(data.data);
            setMaxPage(data.last_page);
        })
        .catch(error => {
            setTableLoading(false);
            console.error('Error: ', error);
        });
    }, [currentPage, rowsPerPage, debounceSearch, decrypted_access_token]);
    /* eslint-disable */

    const get_roles = () => {
        axios_get_header(get_Roles, decrypted_access_token)
        .then(response => { setRoles(response.data.roles); })
        .catch(error => { console.log(error); });
    }

    const formDataReset = () => {
        setFormData((prevState) => ({
            ...prevState,
            id: '',
            email: '',
            username: '',
            role: ''
        }));
        setEditIndex(0);
    }

    const handleDialog = (status) => {
        if (status === false) {
            setDialog(status);
            formDataReset();
            setRoles([]);
        } else {
            get_roles();
            setDialog(status);
        }
    }

    const handleDisableDialog = (status) => { setDisableDialog(status); }

    const get_user = (editIndexValue, user_id) => {
        setEditIndex(editIndexValue);
        axios_get_header(get_Account_info + user_id, decrypted_access_token)
        .then(response => {
            const user = response.data.user_info;
            if (editIndexValue === 2) {
                handleDisableDialog(true);
                setFormData((prevState) => ({
                    ...prevState,
                    id: user.id,
                }));
            } else {
                handleDialog(true);
                setEditIndex(editIndexValue);
                setFormData((prevState) => ({
                    ...prevState,
                    id: user.id,
                    role: user.role,
                    email: user.email,
                    username: user.username
                }));
            }
        })
        .catch(error => { console.log(error); });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(setFormData, name, value);

        switch(name) {
            case 'email':
                if (!EmailValidator.validate(value)) {
                    setErrorHelper(name, true, 'E-mail address is invalid', setFormDataError, setFormDataHelperText);
                } else if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'username':
                if (nullCheck(value)) {
                    setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
                } else {
                    setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
                }
                break;
            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let payload = {};

        if (editIndex === 0) {
            payload = {
                username: formData.username,
                email: formData.email,
                role: formData.role
            };
        } else {
            payload = {
                role: formData.role
            };
        }

        let hasError = false
        for (const field in formData) {
            if (field !== 'id') {
                if (formDataError[field] === true || formData[field] === "") {
                    hasError = true;
                }
            }
        }

        if (formData.role === "") {
            toast.error(empty_field_warning);
            setFormDataError((prevError) => ({ ...prevError, role: true }));
        } else if (hasError) {
            toast.error("Check for empty or error fields.");
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_put_header(`${update_User}${formData.id}`, payload, decrypted_access_token)
                .then(response => {
                    handleDialog(false);
                    setLoading(false);
                    get_users();
                    toast.success(response?.data?.message);
                })
                .catch(error => {
                    setLoading(false);
                    console.error('Update Error: ', error);
                });
            } else {
                axios_post_header(create_User, payload, decrypted_access_token)
                .then(response => {
                    handleDialog(false);
                    setLoading(false);
                    get_users();
                    toast.success(response?.data?.message);
                })
                .catch(error => {
                    setLoading(false);
                    toast.error(error.response.data.message);
                    console.error('Create Error: ', error);
                });
            }
        }
    }

    const disable_user = (e) => {
        e.preventDefault();

        setLoading(true);
        axios_delete_header(disable_User + formData.id, {}, decrypted_access_token)
        .then(response => {
            toast.success(response.data.message);
            handleDisableDialog(false);
            formDataReset();
            setLoading(false);
            get_users();
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        });
    }

    const role_select = (disabled_select) => (
        <Select
            labelId="role"
            id="role"
            label="Role"
            name="role"
            fullWidth
            value={formData.role}
            error={formDataError.role}
            onChange={handleChange}
            disabled={disabled_select}
        >
            { roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                    { role.role_name }
                </MenuItem>
            )) }
        </Select>
    )

    return(
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 3 }} display="flex">

            {/* dialog for creating user or updating user permissions */}
            <Dialog open={dialog} onClose={() => handleDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New User</DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container direction="column" rowSpacing={2.5}>
                        <Grid item>
                            <TextField
                                label="E-mail Address"
                                name="email"
                                value={formData.email}
                                error={formDataError.email}
                                helperText={formDataHelperText.email}
                                type="email"
                                onChange={handleChange}
                                disabled={editIndex === 1 ? true : false}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Username"
                                name="username"
                                value={formData.username}
                                error={formDataError.username}
                                helperText={formDataHelperText.username}
                                onChange={handleChange}
                                disabled={editIndex === 1 ? true : false}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                {roles.length > 0 ? (<InputLabel id="role">Role</InputLabel>) : ''}
                                {editIndex === 0 ? (
                                    role_select(false)
                                ) : (
                                    roles.length > 0 ? (
                                        <Select
                                            labelId="role"
                                            id="role"
                                            label="Role"
                                            name="role"
                                            fullWidth
                                            value={formData.role}
                                            error={formDataError.role}
                                            onChange={handleChange}
                                        >
                                            { roles.length > 0 ? (roles.map(role => (
                                                <MenuItem key={role.id} value={role.id}>
                                                    { role.role_name }
                                                </MenuItem>
                                            ))) : (<MenuItem value="">&nbsp;</MenuItem>) }
                                        </Select>
                                    ) : <p>Loading Roles...</p>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" display="flex" justifyContent="flex-end" alignItems="center" sx={{ mr: 2, mb: 1 }} columnSpacing={{ lg: 1, xl: 1 }}>
                        <Grid item>
                            <ErrorColorBtn displayText="Cancel" endIcon={<CancelRounded />} onClick={() => handleDialog(false)} />
                        </Grid>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                loading={loading}
                                endIcon={<GroupAddOutlined />}
                                onClick={handleSubmit}
                                displayText={editIndex === 1 ? 'Update User' : 'Create User'}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            <Dialog open={disableDialog} onClose={() => handleDisableDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Disable User Access?</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to remove this user account? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" direction="row" columnSpacing={1} sx={{ mr: 1, mb: 1 }}>
                        <Grid item>
                            <PrimaryColorBtn displayText="Cancel" endIcon={<CancelOutlined />} onClick={() => handleDisableDialog(false)}/>
                        </Grid>
                        <Grid item>
                            <ErrorColorLoadingBtn
                                loading={loading}
                                loadingPosition="end"
                                endIcon={<PersonOffRounded />}
                                onClick={disable_user}
                                displayText={loading ? 'Removing Account...' : 'Remove Account'}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }} rowSpacing={2} sx={{ mr: .3, ml: 1 }}>
                <Grid item lg={3} xl={3} sm={3} xs={12}>
                    <BreadCrumbsCmp data={crumbsHelper('', 'Members', '')} />
                </Grid>
                <Grid item lg={9} xl={9} sm={9} xs={12}>
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1, sm: 1, xs: 1 }} rowSpacing={1.5}>
                        <Grid item justifyContent="end" display="flex">
                            <PrimaryColorBtn displayText="Refresh Table" endIcon={<RefreshOutlined />} onClick={get_users} />
                        </Grid>
                        <Grid item justifyContent="end" display="flex">
                            <PrimaryColorBtn displayText="Create New User" endIcon={<PersonAddAlt1Outlined />} onClick={() => handleDialog(true)} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <TableComponentV2
                columns={columns}
                rows={rows}
                loadingTable={tableLoading}
                size={rowsPerPage}
                setSize={setRowsPerPage}
                page={currentPage}
                setPage={setCurrentPage}
                total={maxPage}
                search={search}
                setSearch={setSearch}
                sx={{ mb: 5 }}
            />
        </Grid>
    );
}

export default UserAccounts;