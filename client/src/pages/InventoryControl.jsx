import React, { useEffect, useState } from "react";
import { axios_get_header } from '../request/apiRequests';
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { decryptAccessToken, decryptRoleId, decryptAuthId } from "../auth/AuthUtils";

function InventoryControl() {
    document.title = 'InventoryIQ: Inventory Control';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_role = decryptRoleId();
    const decrypted_auth = decryptAuthId();

    const [subNav, setSubNav] = useState([]);
    
    const get_inventoryControl_subNavs = () => {
        axios_get_header('/user_sub_nav/get_inventoryControl_sub_navigations/' + decrypted_role + '/' + decrypted_auth, decrypted_access_token)
        .then(response => { setSubNav(response.data.sub_navigations); })
        .catch(error => { console.log(error); })
    };

    /* eslint-disable */
    useEffect(() => {
        get_inventoryControl_subNavs();
    }, []);
    /* eslint disable */

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" rowSpacing={3} columnSpacing={{ lg: 3, xl: 3 }} display="flex" sx={{ pt: 2, px: 4 }}>
            {subNav.map(function(subnav) {
                return (
                    <Grid item lg={6} xl={6} key={subnav.id}>
                        <Card raised>
                            <CardContent>
                                <Typography variant="h5" to={subnav.sub_navigation_url} component={Link} sx={{ color: 'inherit', textDecoration: 'none' }}>
                                    { subnav.sub_navigation_name }
                                </Typography><br />
                                <Typography variant="caption" sx={{ mt: 5 }}>
                                    {subnav.sub_navigation_desc}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
}

export default InventoryControl;