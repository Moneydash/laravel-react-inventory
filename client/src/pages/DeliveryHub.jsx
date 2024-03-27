import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { decryptAccessToken, decryptRoleId, decryptAuthId } from "utils/auth";
import { axios_get_header } from "utils/requests";
import { Link } from "react-router-dom";
import { get_deliveryHub_subNav } from 'utils/services';

function DeliveryHub() {
    document.title = 'InventoryIQ: Delivery Hub';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_role = decryptRoleId();
    const decrypted_auth = decryptAuthId();

    const [subnav, setSubnav] = useState([]);

    const get_product_delivery_subnavs = () => {
        axios_get_header(get_deliveryHub_subNav + decrypted_role + '/' + decrypted_auth, decrypted_access_token)
        .then(response => { setSubnav(response.data.sub_navigations); })
        .catch(error => { console.log(error); })
    };

    /* eslint-disable */
    useEffect(() => {
        get_product_delivery_subnavs();
    }, []);
    /* eslint-disable */

    return(
        <Grid container justifyContent="flex-start" direction="row" alignItems="center" rowSpacing={3} columnSpacing={{ lg: 3, xl: 3, sm: 3 }} sx={{ px: 4 }} mt={{ xs: 3, sm: .5, xl: .5, lg: .5 }}>
            {subnav.map(function(subnav) {
                return (
                    <Grid item lg={4} xl={3} sm={6} xs={12} key={subnav.id}>
                        <Card raised>
                            <CardContent>
                                <Typography variant="h6" to={subnav.sub_navigation_url} component={Link} sx={{ color: 'inherit', textDecoration: 'none' }}>
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