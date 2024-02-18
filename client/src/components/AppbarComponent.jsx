import { Inventory2Rounded } from "@mui/icons-material";
import { AppBar, Button, Icon, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";


function AppbarComponent() {
    const location = useLocation();

    const targetUrl = location.pathname === '/register' ? '/' : '/register';
    return (
        <AppBar position="fixed">
            <Toolbar variant="dense">
                <Icon sx={{ mb: 1 }}><Inventory2Rounded fontSize="small"/></Icon>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, pl: 1 }}>InventoryIQ</Typography>
                <Button color="inherit" href={targetUrl}>
                    { location.pathname === '/register' ? 'Log In' : 'Register' }
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default AppbarComponent;