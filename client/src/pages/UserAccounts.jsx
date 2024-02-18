import { CancelOutlined, CancelRounded, CloseRounded, EditRounded, GroupAddOutlined, PersonAddAlt1Outlined, PersonOffRounded, RefreshOutlined } from "@mui/icons-material";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DataGrid } from "@mui/x-data-grid";
import React, { Fragment, useEffect, useState } from "react";
import { axios_get_header, axios_patch_header, axios_post_header, axios_put_header } from '../request/apiRequests';
import * as EmailValidator from 'email-validator';
import { decryptAccessToken, decryptAuthId } from '../auth/AuthUtils';  

function UserAccounts() {
    document.title = 'InventoryIQ: User Accounts';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_auth_id = decryptAuthId();
    const empty_field_warning = "Please fill up required field!";

    const renderActionButtons = (params) => {
        return(
            <div>
                <IconButton onClick={() => get_user(1, params.value)} color="primary" sx={{ ml: 1 }}>
                    <Tooltip title="Update User Role" placement="bottom" arrow><EditRounded fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => get_user(2, params.value)} color="error" sx={{ ml: 1 }} disabled={params.value === decrypted_auth_id}>
                    <Tooltip title="Disable User Account" placement="bottom" arrow><PersonOffRounded fontSize="small"/></Tooltip>
                </IconButton>
            </div>
        );
    }

    const columns = [
        { field: 'email', headerName: 'Email Address', flex: 1 },
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'status', headerName: 'User Status', flex: 1 },
        { field: 'created_at', headerName: 'Created At', flex: 1 },
        { field: 'updated_at', headerName: 'Updated At', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];

    const [rows, setRows] = useState([]);
    const [editIndex, setEditIndex] = useState(0);
    const [dialog, setDialog] = useState(false);
    const [disableDialog, setDisableDialog] = useState(false);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

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

    const get_users = () => {
        setTableLoading(true);
        axios_get_header('/user/get_users', decrypted_access_token)
        .then(response => {
            const data = response.data.users_list;
            const transformedData = data.map(user => {
                const created_date = new Date(user["created_at"]);
                const updated_date = new Date(user["updated_at"]);

                // Extract the date and time components for created_at
                const created_year = created_date.getFullYear();
                const created_month = (created_date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
                const created_day = created_date.getDate().toString().padStart(2, '0');
                const created_hours = created_date.getHours().toString().padStart(2, '0');
                const created_minutes = created_date.getMinutes().toString().padStart(2, '0');
                const created_seconds = created_date.getSeconds().toString().padStart(2, '0');

                // Extract the date and time components for updated_at
                const updated_year = updated_date.getFullYear();
                const updated_month = (updated_date.getMonth() + 1).toString().padStart(2, '0');
                const updated_day = updated_date.getDate().toString().padStart(2, '0');
                const updated_hours = updated_date.getHours().toString().padStart(2, '0');
                const updated_minutes = updated_date.getMinutes().toString().padStart(2, '0');
                const updated_seconds = updated_date.getSeconds().toString().padStart(2, '0');

                // Create the formatted date string in "yyyy-mm-dd HH:mm:ss" format
                const formattedDate_created = `${created_year}-${created_month}-${created_day} ${created_hours}:${created_minutes}:${created_seconds}`;
                const formattedDate_updated = `${updated_year}-${updated_month}-${updated_day} ${updated_hours}:${updated_minutes}:${updated_seconds}`;
                const string_status = user['status'] === 1 ? 'Active' : 'Deleted';

                return {
                    id: user['id'],
                    email: user['email'],
                    username: user['username'],
                    role: user.roles[0]['role_name'],
                    created_at: formattedDate_created,
                    updated_at: formattedDate_updated,
                    status: string_status
                }
            });

            setTableLoading(false);
            setRows(transformedData);
        })
        .catch(error => { console.error('Error: ' + error); });
    }
    
    /* eslint-disable */
    useEffect(() => {
        get_users();
    }, []);
    /* eslint-disable */

    const refreshTable = () => {
        setRows([]);
        get_users();
    }

    const get_roles = () => {
        axios_get_header('/user/get_roles', decrypted_access_token)
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
        axios_get_header('/user/get_user/' + user_id, decrypted_access_token)
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

    const handleSnackbar = (status, message) => { setSnackbar((prevSnack) => ({ ...prevSnack, open: status, message: message })); }
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
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));

        if (name === "email") {
            if (!EmailValidator.validate(value)) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'E-mail address is invalid' }));
            } else if (value === "") {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === "username") {
            if (value === "") {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
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
            handleSnackbar(true, empty_field_warning);
            setFormDataError((prevError) => ({ ...prevError, role: true }));
        } else if (hasError) {
            handleSnackbar(true, "Check for empty or error fields!");
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_put_header('/user/update_user/' + formData.id, payload, decrypted_access_token)
                .then(response => {
                    handleDialog(false);
                    setLoading(false);
                    get_users();
                    handleSnackbar(true, response.data.message);
                })
                .catch(error => { console.log(error); });
            } else {
                axios_post_header('/user/create_user', payload, decrypted_access_token)
                .then(response => {
                    handleDialog(false);
                    setLoading(false);
                    get_users();
                    handleSnackbar(true, response.data.message); })
                .catch(error => { handleSnackbar(true, error.response.data.message); });
            }
        }
    }

    const disable_user = (e) => {
        e.preventDefault();

        setLoading(true);
        axios_patch_header('/user/disable_user/' + formData.id, {}, decrypted_access_token)
        .then(response => {
            handleSnackbar(true, response.data.message);
            handleDisableDialog(false);
            formDataReset();
            setLoading(false);
            get_users();
        })
        .catch(error => { console.log(error); });
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
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 5 }}>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => handleSnackbar(false, '')} message={snackbar.message} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} action={action} />
            
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
                            <Button variant="contained" color="error" endIcon={<CancelRounded />} onClick={() => handleDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            { loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>{ editIndex === 1 ? 'Updating User' : 'Creating Supplier' }</LoadingButton> : <Button variant="contained" color="primary" endIcon={<GroupAddOutlined />} onClick={handleSubmit}>{ editIndex === 1 ? 'Update' : 'Create' } User</Button> }
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            <Dialog open={disableDialog} onClose={() => handleDisableDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Disable User Access?</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to disable this user account?</Typography>
                </DialogContent>
                <DialogActions>
                    <Grid container justifyContent="flex-end" direction="row" columnSpacing={1} sx={{ mr: 1, mb: 1 }}>
                        <Grid item>
                            <Button variant="contained" endIcon={<CancelOutlined />} onClick={() => handleDisableDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            {loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Disabling Account...</LoadingButton> : <Button variant="contained" endIcon={<PersonOffRounded />} color="error" onClick={disable_user}>Disable Account</Button>}
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            
            <Grid container justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }}>
                <Grid item>
                    <Button variant="contained" endIcon={<RefreshOutlined />} onClick={refreshTable}>Refresh Table</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" endIcon={<PersonAddAlt1Outlined />} onClick={() => handleDialog(true)}>Create New User</Button>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" alignItems="center" sx={{ mt: 2 }}>
                <Card raised sx={{ width: '100%' }}>
                    <CardContent>
                        <DataGrid rows={rows} columns={columns} loading={tableLoading} autoHeight/>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default UserAccounts;