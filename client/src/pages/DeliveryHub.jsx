import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { decryptAccessToken, decryptRoleId, decryptAuthId } from "utils/auth";
import { axios_get_header } from "utils/requests";
import { Link } from "react-router-dom";
import { get_deliveryHub_subNav } from 'utils/services';
import { toast } from "react-toastify";
import { ScaleLoader } from "react-spinners";

function DeliveryHub() {
    document.title = 'InventoryIQ: Delivery Hub';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_role = decryptRoleId();
    const decrypted_auth = decryptAuthId();
    const [loading, setLoading] = useState(true);

    const [subnav, setSubnav] = useState([]);

    const get_product_delivery_subnavs = () => {
        axios_get_header(get_deliveryHub_subNav + decrypted_role + '/' + decrypted_auth, decrypted_access_token)
        .then(response => {
            setLoading(false);
            setSubnav(response.data.sub_navigations);
        })
        .catch(error => {
            setLoading(false);
            toast.error("Oops, something went wrong. Please try again later.");
            console.log(error);
        })
    };

    /* eslint-disable */
    useEffect(() => {
        get_product_delivery_subnavs();
    }, []);
    /* eslint-disable */

    return(
        <Grid container justifyContent="flex-start" direction="row" alignItems="center" rowSpacing={3} columnSpacing={{ lg: 3, xl: 3, sm: 3 }} sx={{ px: 4 }} mt={{ xs: 3, sm: .5, xl: .5, lg: .5 }}>
            {loading ? (
                <Grid item xs={12} lg={12} xl={12} display="flex" justifyContent="center" alignItems="center" sx={{ mt: 30 }}>
                    <Stack direction="column" spacing={1} alignItems="center">
                        <ScaleLoader color="#1976d2" />
                        <Typography variant="subtitle1">Just a Moment</Typography>
                    </Stack>
                </Grid>
            ) : (
                subnav.map(function(subnav) {
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

export default DeliveryHub;