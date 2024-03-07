import React, { useState, Fragment, useEffect } from "react";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import { CloseRounded, RefreshOutlined, VpnKeyRounded } from "@mui/icons-material";
import { LoadingButton } from '@mui/lab';
import { axios_get_header, axios_post } from "../request/apiRequests";
import { AES, enc } from 'crypto-js';
import AppbarComponent from "../components/AppbarComponent";

function Login() {
    document.title = 'InventoryIQ: Log In';
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formDataError, setFormDataError] = useState({
        email: false,
        password: false,
    });
    const [formDataHelperText, setFormDataHelperText] = useState({
        email: '',
        password: ''
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));

        if (value === '') {
            setFormDataError((prevError) => ({ ...prevError, [name]: true }));
            setFormDataHelperText((prevText) => ({ ...prevText, [name]: 'Please fill up required field!' }));
        } else {
            setFormDataError((prevError) => ({ ...prevError, [name]: false }));
            setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true);

        axios_post('/login', formData)
        .then(response => {
            toggleSnackbar(true, response.data.message);

            const expirationMinutes = response.data.expire_at;
            const expirationTime = expirationMinutes * 60000;

            // Calculate the future timestamp by adding expirationTime to the current time
            const now = new Date().getTime();
            const futureTimestamp = now + expirationTime;

            localStorage.setItem('isLoggedIn', 1);
            localStorage.setItem('access_token', AES.encrypt(response.data.access_token, process.env.REACT_APP_SECRET_KEY).toString());
            localStorage.setItem('email_token', AES.encrypt(response.data.user.email, process.env.REACT_APP_SECRET_KEY).toString());
            localStorage.setItem('auth_id', AES.encrypt(response.data.user.id, process.env.REACT_APP_SECRET_KEY).toString());
            localStorage.setItem('role_id', AES.encrypt(response.data.user.roles[0]['id'], process.env.REACT_APP_SECRET_KEY).toString());
            localStorage.setItem('expire_at', futureTimestamp);
            localStorage.setItem('selectedIndex', 1);

            setTimeout(() => {
                setLoading(false);
                window.location = "/main/page/products";
            }, 2000);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
            if (error.response.data.email !== undefined) {
                toggleSnackbar(true, error.response.data.email);
            } else if (error.response.data.password !== undefined) {
                toggleSnackbar(true, error.response.data.password);
            } else {
                toggleSnackbar(true, error.response.data.message);
            }
        });
    }

    return(
        <Grid
            container
            direction="row"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
        >
            <AppbarComponent />
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => toggleSnackbar(false, '')} message={snackbar.message} action={action} anchorOrigin={{ horizontal: "center", vertical: "bottom" }}/>
            <Grid item lg={5} xs={12} sm={12} xl={5} pt={{ lg: 10, xl: 15, sm: 10, xs: 10 }} sx={{ background: '#fafafa' }}>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item lg={12} xs={12} sm={8} xl={12}>
                        <img src={process.env.REACT_APP_URL + '/logo/logo-transparent-new.png'} style={{ height: '200px' }} />
                        <Typography variant="h5" justifyContent="center" alignItems="center" sx={{ fontWeight: 'bold' }}>Web-Based Inventory Management App</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={7} xs={12} sm={12} xl={7} pt={{ lg: 40, xl: 40, sm: 5, xs: 5 }} px={{ xs: 5 }} sx={{ background: '#fefefe'}}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item lg={7} xs={12} sm={8} xl={5}>
                        <Card elevation={12}>
                            <CardHeader
                                title="Log In"
                                titleTypographyProps={{ variant: "h5", fontWeight: 'bold' }}
                                sx={{ pl: 2.5 }}
                            ></CardHeader>
                            <Divider />
                            <form onSubmit={handleSubmit}>
                                <CardContent>
                                    <Grid container direction="column" rowSpacing={2}>
                                        <Grid item>
                                            <TextField
                                                name="email"
                                                label="E-mail"
                                                variant="outlined"
                                                type="email"
                                                value={formData.email}
                                                error={formDataError.email}
                                                helperText={formDataHelperText.email}
                                                onChange={handleChange}
                                                fullWidth
                                                autoComplete="username"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                name="password"
                                                label="Password"
                                                variant="outlined"
                                                type="password"
                                                value={formData.password}
                                                error={formDataError.password}
                                                helperText={formDataHelperText.password}
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Grid container justifyContent="flex-end" sx={{ mr: 1, mb: 1 }}>
                                        <Grid item>
                                            { loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />} variant="outlined">Logging In</LoadingButton> :  <Button variant="contained" color="success" endIcon={<VpnKeyRounded />} type="submit">Log In</Button>}
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Login;