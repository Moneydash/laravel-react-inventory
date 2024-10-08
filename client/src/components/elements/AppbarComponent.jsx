import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";


function AppbarComponent() {
    const location = useLocation();

    const targetUrl = location.pathname === '/register' ? '/' : '/register';
    return (
        <AppBar position="fixed">
            <Toolbar variant="dense">
                <img src={process.env.REACT_APP_URL + '/logoV2/favicon.ico'} style={{ height: '20px', marginTop: '-1.5px' }} alt="Logo" />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 1 }}>InventoryIQ</Typography>
                <Button color="inherit" href={targetUrl}>
                    { location.pathname === '/register' ? 'Sign In' : 'Sign Up' }
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default AppbarComponent;