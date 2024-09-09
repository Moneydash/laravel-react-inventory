import React, { useEffect, useState } from "react";
import { axios_get_header } from 'utils/requests';
import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { decryptAccessToken, decryptRoleId, decryptAuthId } from "utils/auth";
import { get_inventory_subNav } from 'utils/services';
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";

function InventoryControl() {
    document.title = 'InventoryIQ: Inventory Control';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_role = decryptRoleId();
    const decrypted_auth = decryptAuthId();
    const [loading, setLoading] = useState(true);

    const [subNav, setSubNav] = useState([]);
    
    const get_inventoryControl_subNavs = () => {
        axios_get_header(`${get_inventory_subNav}${decrypted_role}/${decrypted_auth}`, decrypted_access_token)
        .then(response => {
            setSubNav(response.data.sub_navigations);
            setLoading(false);
        })
        .catch(error => {
            setLoading(false);
            toast.error("Oops, something went wrong. Please try again later.");
            console.log(error);
        })
    };

    /* eslint-disable */
    useEffect(() => {
        get_inventoryControl_subNavs();
    }, []);
    /* eslint disable */

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" rowSpacing={3} columnSpacing={{ lg: 3, xl: 3, sm: 3 }} display="flex" sx={{ px: 4 }} mt={{ xs: 3, sm: .5, xl: .5, lg: .5 }}>
            {loading ? (
                // Show loader if loading
                <Grid item xs={12} lg={12} xl={12} display="flex" justifyContent="center" alignItems="center" sx={{ mt: 30 }}>
                    <Stack direction="column" spacing={1} alignItems="center">
                        <ScaleLoader color="#1976d2" />
                        <Typography variant="subtitle1">Just a Moment</Typography>
                    </Stack>
                </Grid>
            ) : (
                subNav.map(function(subnav) {
                    return (
                        <Grid item lg={4} xl={3} sm={6} xs={12} key={subnav.id}>
                            <Card raised>
                                <CardContent>
                                    <Typography variant="subtitle1" to={subnav.sub_navigation_url} component={Link} sx={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}>
                                        { subnav.sub_navigation_name }
                                    </Typography><br />
                                    <Typography variant="body2" sx={{ mt: 1.5 }}>
                                        {subnav.sub_navigation_desc}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })
            )}
        </Grid>
    );
}

export default InventoryControl;