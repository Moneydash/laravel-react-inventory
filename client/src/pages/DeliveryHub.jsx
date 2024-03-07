import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { decryptAccessToken, decryptRoleId, decryptAuthId } from "../auth/AuthUtils";
import { axios_get_header } from "../request/apiRequests";
import { Link } from "react-router-dom";

function DeliveryHub() {
    document.title = 'InventoryIQ: Delivery Hub';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_role = decryptRoleId();
    const decrypted_auth = decryptAuthId();

    const [subnav, setSubnav] = useState([]);

    const get_product_delivery_subnavs = () => {
        axios_get_header('/user_sub_nav/get_prodDelivery_sub_navigations/' + decrypted_role + '/' + decrypted_auth, decrypted_access_token)
        .then(response => { setSubnav(response.data.sub_navigations); })
        .catch(error => { console.log(error); })
    };

    /* eslint-disable */
    useEffect(() => {
        get_product_delivery_subnavs();
    }, []);
    /* eslint-disable */

    return(
        <Grid container justifyContent="flex-start" direction="row" alignItems="center" rowSpacing={3} columnSpacing={{ lg: 3, xl: 3 }} sx={{ px: 4, mt: 2 }}>
            {subnav.map(function(subnav) {
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

export default DeliveryHub;