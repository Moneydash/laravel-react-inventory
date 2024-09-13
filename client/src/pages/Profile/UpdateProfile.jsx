import { Button, Card, CardActions, CardContent, Divider, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { axios_get_header, axios_put_header } from 'utils/requests';
import { LoadingButton } from "@mui/lab";
import { ManageAccountsOutlined, RefreshOutlined } from "@mui/icons-material";
import * as EmailValidator from 'email-validator';
import { decryptAccessToken, decryptAuthId } from "utils/auth";
import { get_Account_info, update_Account } from "utils/services";
import { nullCheck, setData, setErrorHelper } from "utils/helper";
import { toast } from "react-toastify";
import { PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";

function UpdateProfile() {
    document.title = 'InventoryIQ: User Preferences - Update Profile';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_auth_id = decryptAuthId();
    const empty_field_warning = "Please fill up required field!";
    const [loading, setLoading] = useState(false);
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
        axios_get_header(`${get_Account_info}${decrypted_auth_id}`, decrypted_access_token)
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

    const handleChange = (e) => {
        const { name, value} = e.target;
        setData(setFormData,name, value);
        
        switch (name) {
            case 'username':
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'email':
                if (!EmailValidator.validate(value)) {
                    setErrorHelper(name, true, 'Invalid email format', setFormDataError, setFormDataHelperText);
                } else if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            username: formData.username,
            email: formData.email
        };

        setLoading(true);
        axios_put_header(`${update_Account}${decrypted_auth_id}`, payload, decrypted_access_token)
        .then(response => {
            setLoading(false);
            toast.success(response.data.message);
        })
        .catch(error => {
            setLoading(false);
            toast.error(error?.response?.data?.message);
            console.error('Submit Error: ', error);
        });
    }

    return(
        <Grid container direction="row" justifyContent="center" alignItems="center">
            
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
                        <PrimaryColorLoadingBtn
                            loading={loading}
                            loadingPosition="end"
                            endIcon={<ManageAccountsOutlined />}
                            onClick={handleSubmit}
                            displayText={loading ? 'Updating Account Information...' : 'Update Account Information'}
                            sx={{ ml: 1, mb: 2 }}
                        />
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}

export default UpdateProfile;