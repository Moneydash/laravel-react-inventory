import { Button, Card, CardActions, CardContent, Divider, Grid, IconButton, Snackbar, TextField, Typography } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { axios_get_header, axios_put_header } from '../../request/apiRequests';
import { LoadingButton } from "@mui/lab";
import { CloseRounded, ManageAccountsOutlined, RefreshOutlined } from "@mui/icons-material";
import * as EmailValidator from 'email-validator';
import { decryptAccessToken, decryptAuthId } from "../../auth/AuthUtils";

function UpdateProfile() {
    document.title = 'InventoryIQ: User Preferences - Update Profile';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_auth_id = decryptAuthId();
    const empty_field_warning = "Please fill up required field!";
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role_name: ''
    });
    const [formDataError, setFormDataError] = useState({
        username: false,
        email: false
    });
    const [formDataHelperText, setFormDataHelperText] = useState({
        username: '',
        email: ''
    });

    const get_account_info = () => {
        axios_get_header('/user/get_user/' + decrypted_auth_id, decrypted_access_token)
        .then(response => {
            const user = response.data.user_info;
            setFormData((prevState) => ({
                ...prevState,
                username: user.username,
                email: user.email,
                role_name: user.role_name,
            }));
        })
        .catch(error => { console.log(error); });
    }

    /* eslint-disable */
    useEffect(() => {
        get_account_info();
    }, []);
    /* eslint-disable */

    const handleSnackbar = (open, message) => {
        setSnackbar((prevSnack) => ({ ...prevSnack, open: open, message: message }));
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

    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
        
        if (name === 'username') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'email') {
            if (!EmailValidator.validate(value)) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Invalid email format' }));
            } else if (value === '') {
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
        const payload = {
            username: formData.username,
            email: formData.email
        };

        setLoading(true);
        axios_put_header('/user/update_account/' + decrypted_auth_id, payload, decrypted_access_token)
        .then(response => {
            setLoading(false);
            handleSnackbar(true, response.data.message);
        })
        .catch(error => { console.log(error); });
    }

    return(
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <Snackbar open={snackbar.open} onClose={() => handleSnackbar(false, '')} message={snackbar.message} action={action} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
            <Grid item lg={5} xl={5} alignItems="center" sx={{ mt: 10 }}>
                <Card raised sx={{ width: '100%' }}>
                    <CardContent>
                        <Divider sx={{ mt: .25, mb: 2 }}><Typography variant="body2">Account Information</Typography></Divider>
                        <Grid container justifyContent="center" direction="column" rowSpacing={3}>
                            <Grid item>
                                <TextField
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    error={formDataError.username}
                                    helperText={formDataHelperText.username}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="E-mail"
                                    name="email"
                                    value={formData.email}
                                    error={formDataError.email}
                                    helperText={formDataHelperText.email}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField label="Assigned Role" name="role" value={formData.role_name} fullWidth disabled />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        {loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Updating Account Information...</LoadingButton> : <Button variant="contained" color="primary" endIcon={<ManageAccountsOutlined />} sx={{ ml: 1, mb: 2 }} onClick={handleSubmit}>Update Account Information</Button>}
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}

export default UpdateProfile;