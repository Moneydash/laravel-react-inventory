import React, { useState, Fragment, useEffect } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Snackbar, TextField } from '@mui/material';
import { CloseRounded, GroupAddOutlined } from '@mui/icons-material';
import { axios_get_header, axios_post } from "../request/apiRequests";
import * as EmailValidator from 'email-validator';
import AppbarComponent from "../components/AppbarComponent";
import { AES, enc } from "crypto-js";

function Register() {
    document.title = 'InventoryIQ: Sign Up';
    const empty_field_warning = 'Please fill up required field!';
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        conf_password: ''
    });

    // for validation
    const [formDataError, setFormDataError] = useState({
        username: false,
        email: false,
        password: false,
        conf_password: false
    });
    const [formDataHelperText, setFormDataHelperText] = useState({
        username: '',
        email: '',
        password: '',
        conf_password: ''
    });

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        // check if access token is not empty and a valid one.
        if (access_token !== null && access_token !== undefined) {
            axios_get_header('/checkAuth', AES.decrypt(access_token, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8))
            .then(response => {
                console.log(response);
                window.location = "/main/page";
            })
            .catch(error => {
                console.log(error);
                localStorage.clear();
                window.location = "/";
            });
        }
    }, []);

    const toggleSnackbar = (status, message) => { setSnackbar((prevSnack) => ({ ...prevSnack, open: status, message: message })); }
    const action = (
        <Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => toggleSnackbar(false, '')}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Fragment>
    );

    // for inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        const strong_regex_pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{15,}$/;

        setFormData((prevState) => ({ ...prevState, [name]: value }));

        // username
        if (name === 'username') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }
        // email
        if (name === 'email') {
            if (!EmailValidator.validate(formData.email)) {
                setFormDataError((prevError) => ({ ...prevError, email: true, }));
                setFormDataHelperText((prevText) => ({ ...prevText, email: 'Email is invalid' }));
            } else if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, email: true, }));
                setFormDataHelperText((prevText) => ({ ...prevText, email: empty_field_warning }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, email: false, }));
                setFormDataHelperText((prevText) => ({ ...prevText, email: '' }));
            }
        }

        // password
        if (name === 'password') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, password: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, password: empty_field_warning }));
            } else if (value < 15 || !strong_regex_pass.test(value)) {
                setFormDataError((prevError) => ({ ...prevError, password: true, }));
                setFormDataHelperText((prevText) => ({ ...prevText, password: 'Password is too weak!' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, password: false, }));
                setFormDataHelperText((prevText) => ({ ...prevText, password: '' }));
            }
        }

        // confirm password
        if (name === 'conf_password') {
            if (value === '') {
                setFormDataError((prevError) => ({ ...prevError, conf_password: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, conf_password: empty_field_warning }));
            } else if (value !== formData.password) {
                setFormDataError((prevError) => ({ ...prevError, conf_password: true, }));
                setFormDataHelperText((prevText) => ({ ...prevText, conf_password: 'Password do not match!' }));
            } else {
                setFormDataError((prevError) => ({ ...prevError, conf_password: false, }));
                setFormDataHelperText((prevText) => ({ ...prevText, conf_password: '' }));
            }
        }
    }

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password
        };

        console.log(payload);

        if (formData.conf_password === formData.password) {
            axios_post('/register', payload)
            .then(response => {
                toggleSnackbar(true, response.data.message);
                setFormData((prevState) => ({ ...prevState, username: '', email: '', password: '', conf_password: '' }));

                setTimeout(() => {
                    toggleSnackbar(false, '');
                    window.location = "/";
                }, 3000);
            })
            .catch(error => { toggleSnackbar(true, error.response.data.message); });
        } else {
            toggleSnackbar(true, 'Please confirm your password');
        }
    }

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: '100vh' }}
        >
            <AppbarComponent />
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => toggleSnackbar(false, '')} message={snackbar.message} action={action} anchorOrigin={{ horizontal: "center", vertical: "bottom" }}/>
            <Grid item lg={3} xs={12} sm={8} xl={3} sx={{ m: 4 }}>
                <Card elevation={12}>
                    <CardHeader
                        title="Register"
                        titleTypographyProps={{ variant: "h5", fontWeight: 'bold' }}
                        sx={{ pl: 3 }}
                    ></CardHeader>
                    <Divider />
                    <CardContent>
                        <Grid container direction="column" rowSpacing={2}>
                            <Grid item>
                                <TextField
                                    name="username"
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.username}
                                    onChange={handleChange}
                                    error={formDataError.username}
                                    helperText={formDataHelperText.username}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    name="email"
                                    label="E-mail"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={formDataError.email}
                                    helperText={formDataHelperText.email}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    name="password"
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={formDataError.password}
                                    helperText={formDataHelperText.password}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    name="conf_password"
                                    label="Confirm Password"
                                    variant="outlined"
                                    type="password"
                                    fullWidth
                                    value={formData.conf_password}
                                    onChange={handleChange}
                                    error={formDataError.conf_password}
                                    helperText={formDataHelperText.conf_password}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>
                        <Grid container justifyContent="flex-end" sx={{ mr: 1, mb: 1 }}>
                            <Grid item>
                                <Button variant="contained" color="primary" endIcon={<GroupAddOutlined />} onClick={handleSubmit}>Register</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Register;