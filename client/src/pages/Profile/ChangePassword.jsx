import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    FormGroup,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import { CancelOutlined, LockResetOutlined, SendRounded } from "@mui/icons-material";
import { axios_patch_header } from 'utils/requests';
import { decryptAccessToken, decryptAuthId } from "utils/auth";
import { toast } from "react-toastify";
import { nullCheck, setData, setErrorHelper } from "utils/helper";
import { change_Password } from "utils/services";
import { PrimaryColorBtn, PrimaryColorLoadingBtn } from "components/elements/ButtonsComponent";

function ChangePassword() {
    document.title = 'InventoryIQ: User Preferences - Change Password';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_auth_id = decryptAuthId();
    const empty_field_warning = 'Please fill up required field!';
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        conf_password: ''
    });
    const [formDataError, setFormDataError] = useState({
        old_password: false,
        new_password: false,
        conf_password: false
    });
    const [formDataHelperText, setFormDataHelperText] = useState({
        old_password: '',
        new_password: '',
        conf_password: ''
    });

    const formDataReset = () => {
        setFormData((prevState) => ({
            ...prevState,
            new_password: '',
            conf_password: ''
        }));
    };
    
    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        const strong_regex_pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{15,}$/;
        setData(setFormData, name, value);

        switch (name) {
            case 'old_password':
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'new_password':
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (value < 15 || !strong_regex_pass.test(value)) {
                    setErrorHelper(name, true, "Password is too weak!", setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'conf_password':
                if (nullCheck(value)) {
                    setErrorHelper(name, true, empty_field_warning, setFormDataError, setFormDataHelperText);
                } else if (value !== formData.new_password) {
                    setErrorHelper(name, true, 'Password do not match!', setFormDataError, setFormDataHelperText);
                } else {
                    setErrorHelper(name, false, '', setFormDataError, setFormDataHelperText);
                }
                break;
            case 'show_password':
                setShowPassword(checked);
                break;
            default:
                break;
        }
    };

    const handleDialog = (open) => {
        if (open === false) {
            setDialog(open);
            setData(setFormData, 'old_password', '');
        } else {
            setDialog(open);
        }
    }

    const PreSubmit = (e) => {
        e.preventDefault();

        let hasError = false;
        for (const field in formData) {
            if (formDataError[field] === true) {
               hasError = true; 
            }
        }

        if (hasError) {
            toast.error('Oops! Something went wrong. Please check for field errors.');
        } else if (nullCheck(formData.new_password)) {
            toast.error('Please enter a new password.');
            setErrorHelper('new_password', true, empty_field_warning, setFormDataError, setFormDataHelperText);
        } else if (nullCheck(formData.conf_password)) {
            toast.error('Please confirm your new password.');
            setErrorHelper('conf_password', true, empty_field_warning, setFormDataError, setFormDataHelperText);
        } else {
            handleDialog(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            old_password: formData.old_password,
            new_password: formData.new_password
        };

        if (!nullCheck(formData.old_password)) {
            setLoading(true);
            axios_patch_header(`${change_Password}${decrypted_auth_id}`, payload, decrypted_access_token)
            .then(response => {
                setLoading(false);
                handleDialog(false);
                formDataReset();
                toast.success(response.data.message);
            })
            .catch(error => {
                setLoading(false);
                toast.error(error.response.data.error);
            })
        } else {
            toast.error('Please enter your current password.');
        }
    };

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">

            {/* dialog for password confirmation */}
            <Dialog open={dialog} fullWidth maxWidth="sm"> 
                <DialogTitle>Please enter current password</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, ml: .5 }}>For your security, you must enter your current password to continue.</Typography>
                    <TextField
                        label="Current Password"
                        name="old_password"
                        value={formData.old_password}
                        error={formDataError.old_password}
                        helperText={formDataHelperText.old_password}
                        type="password"
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Grid container direction="row" columnSpacing={{ lg: 1.5, xl: 1.5 }} justifyContent="flex-end" sx={{ mr: 2, mb: 1 }}>
                        <Grid item>
                            <Button variant="contained" color="error" endIcon={<CancelOutlined />} onClick={() => handleDialog(false)}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            <PrimaryColorLoadingBtn
                                loading={loading}
                                loadingPosition="end"
                                endIcon={<SendRounded fontSize="small" />}
                                onClick={handleSubmit}
                                displayText={loading ? 'Updating Password...' : 'Submit'}
                            />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/* new password and password confirmation card */}
            <Grid item lg={5} xl={5} alignItems="center" sx={{ mt: 10 }}>
                <Card raised sx={{ width: '100%' }}>
                    <CardContent>
                        <Divider sx={{ mt: .25, mb: 2 }}><Typography variant="body2">Manage Account Security</Typography></Divider>
                        <Grid container justifyContent="center" direction="column" rowSpacing={3}>
                            <Grid item>
                                <TextField
                                    label="New Password"
                                    name="new_password"
                                    value={formData.new_password}
                                    error={formDataError.new_password}
                                    helperText={formDataHelperText.new_password}
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="Confirm New Password"
                                    name="conf_password"
                                    value={formData.conf_password}
                                    error={formDataError.conf_password}
                                    helperText={formDataHelperText.conf_password}
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    onPaste={(e) => e.preventDefault()}
                                />
                                <FormGroup sx={{ ml: .5 }}>
                                    <FormControlLabel control={<Checkbox />} label="Show Password" name="show_password" checked={showPassword} onChange={handleChange} />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Grid container direction="column" rowSpacing={2} sx={{ ml: 1, mb: 2 }}>
                            <Grid item>
                                <PrimaryColorBtn
                                    displayText="Change Password"
                                    endIcon={<LockResetOutlined />}
                                    onClick={PreSubmit}
                                />
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}

export default ChangePassword;