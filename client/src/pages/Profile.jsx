import React, { useEffect, useState } from "react";
import { axios_get_header } from 'utils/requests';
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { decryptAccessToken, decryptRoleId, decryptAuthId } from "utils/auth";
import { get_profile_subNav } from 'utils/services';

function Profile() {
    document.title = 'InventoryIQ: User Preferences';
    const decrypted_access_token = decryptAccessToken();
    const decrypted_role = decryptRoleId();
    const decrypted_auth = decryptAuthId();
    const [subNav, setSubNav] = useState([]);
    
    const get_profile_subNavs = () => {
        axios_get_header(get_profile_subNav + decrypted_role + '/' + decrypted_auth, decrypted_access_token)
        .then(response => { setSubNav(response.data.sub_navigations); })
        .catch(error => { console.log(error); })
    };

    /* eslint-disable */
    useEffect(() => {
        get_profile_subNavs();
    }, []);
    /* eslint disable */

    return (
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" rowSpacing={3} columnSpacing={{ lg: 3, xl: 3 }} display="flex" sx={{ px: 4 }} mt={{ xs: 3, sm: .5, xl: .5, lg: .5 }}>
            {subNav.map(function(subnav) {
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

export default Profile;