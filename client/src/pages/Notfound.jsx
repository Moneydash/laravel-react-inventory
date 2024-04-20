import React from 'react';
import * as Mui from '@mui/material';
import { useMatch, useNavigate } from 'react-router-dom';
import { KeyboardBackspaceOutlined } from '@mui/icons-material';
import Cookies from 'js-cookie';

export default function Notfound() {
    document.title = 'Page Not Found';
    const color = '#787878';
    const navigate = useNavigate();
    const { previousIndex } = localStorage;
    const access_token = Cookies.get('access_token');
    const match = useMatch("*");

    const backToPreviousRoute = () => {
        if (access_token !== undefined && access_token !== null) {
            if (match) {
                navigate(-1);
                localStorage.setItem('selectedIndex', previousIndex);
            } else {
                navigate(-1);
            }
        } else {
            navigate('/');
        }
    };

    return(
        <Mui.Container
            fixed
            align="center"
            justify="center"
            sx={{ mb:30, mt: 10 }}
        >
            <Mui.Typography
                variant="h2"
                component="div"
                style={{ color: color }}
            >
                404
            </Mui.Typography>
            <Mui.Typography
                variant="h5"
                component="div"
                style={{ color: color, letterSpacing:'3px', marginInlineStart:'10px'}}
            >
                PAGE NOT FOUND
            </Mui.Typography>
            <div style={{ marginTop: 10 }}></div>
            <Mui.Typography
                variant="body2"
                component="div"
                style={{ color: color }}
            >
            The page you are looking for doesn't exist or another error occurred.
            </Mui.Typography>
            <Mui.Button variant="contained" onClick={backToPreviousRoute} sx={{m:3}} startIcon={<KeyboardBackspaceOutlined fontSize="small" />}>
                Go Back
            </Mui.Button>
        </Mui.Container>
    );
}
