import { Button, Card, CardActions, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Grid, IconButton, Snackbar, TextField, Typography } from "@mui/material";
import React, { Fragment, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { CancelOutlined, CloseRounded, LockResetOutlined, RefreshOutlined, SendRounded } from "@mui/icons-material";
import { axios_patch_header } from '../../utils/requests';
import { decryptAccessToken, decryptAuthId } from "../../utils/auth";

function ChangePassword() {
    document.title = 'InventoryIQ: User Preferences - Change Password';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_auth_id = decryptAuthId();
    const empty_field_warning = 'Please fill up required field!';
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
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

    const handleSnackbar = (open, message) => { setSnackbar((prevSnack) => ({ ...prevSnack, open: open, message: message })); };
    const action = (
        <Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => handleSnackbar(false, '')}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Fragment>
    );

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

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'old_password') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'new_password') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else if (value < 15 || !strong_regex_pass.test(value)) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: "Password is too weak!" }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'conf_password') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else if (value !== formData.new_password) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Password do not match!' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'show_password') {
            setShowPassword(checked);
        }
    };

    const handleDialog = (open) => {
        if (open === false) {
            setDialog(open);
            setFormData((prevState) => ({ ...prevState, old_password: '' }));
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
            handleSnackbar(true, 'Oops! Something went wrong. Please check for errors.');
        } else if (formData.new_password === '') {
            handleSnackbar(true, 'Please enter a new password.');
            setFormDataError((prevError) => ({ ...prevError, new_password: empty_field_warning }));
        } else if (formData.conf_password === '') {
            handleSnackbar(true, 'Please confirm your new password.');
            setFormDataError((prevError) => ({ ...prevError, conf_password: empty_field_warning }));
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

        if (formData.old_password !== '') {
            setLoading(true);
            axios_patch_header('/user/change_password/' + decrypted_auth_id, payload, decrypted_access_token)
            .then(response => {
                setLoading(false);
                handleDialog(false);
                formDataReset();
                handleSnackbar(true, response.data.message);
            })
            .catch(error => {
                setLoading(false);
                handleSnackbar(true, error.response.data.error);
            })
        }
    };

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center">
            <Snackbar open={snackbar.open} onClose={() => handleSnackbar(false, '')} message={snackbar.message} action={action} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
            
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
                            {loading ? 
                            <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>Updating Account Information...</LoadingButton>
                            : <Button variant="contained" color="primary" endIcon={<SendRounded />} onClick={handleSubmit}>Submit</Button>}
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
                                <Button variant="contained" color="primary" endIcon={<LockResetOutlined />} onClick={PreSubmit}>Change Password</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}

export default ChangePassword;