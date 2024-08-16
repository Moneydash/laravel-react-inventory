import React, { useEffect } from "react";
import Navigation from "../components/elements/Navigation";
import { Box, useMediaQuery } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import { Outlet, useNavigate } from "react-router-dom";
import { axios_get_header } from "../utils/requests";
import { AES, enc } from "crypto-js";
import ToastCmp from "../components/elements/ToastComponent";
import Cookies from "js-cookie";
import { checkAuth } from 'utils/services';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  marginBottom: "-25px",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Home() {
  document.title = 'InventoryIQ: Home';
  const navigate = useNavigate();
  const theme = useTheme();
  const drawerWidth = 330;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const access_token = Cookies.get('access_token');

    // Check if access_token is not null or undefined
    if (access_token !== undefined) {
      if (access_token !== null) {
        try {
            // Attempt to decrypt the access_token
            const decryptedToken = AES.decrypt(access_token, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);

            // Now, check if the decryptedToken is not null or undefined
            if (decryptedToken) {
              try {
                axios_get_header(checkAuth, decryptedToken);
              } catch (error) {
                console.log(error);
                localStorage.clear();
                Cookies.remove();
                navigate("/");
              }
            } else {
                // Handle the case when decryption fails
                console.log("Failed to decrypt access_token");
                localStorage.clear();
                Cookies.remove();
                navigate("/");
            }
        } catch (error) {
            // Handle decryption error
            console.log("Error decrypting access_token:", error);
            localStorage.clear();
            Cookies.remove();
            navigate("/");
        }
      } else {
          localStorage.clear();
          Cookies.remove();
          navigate("/");
      }
    } else {
      localStorage.clear();
      Cookies.remove();
      navigate("/");
    }
  }, [navigate]);

  return(
    <Box sx={{ display: 'flex', width: '100%', height: '100vh'}}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`, // Subtract the drawer width from the total width
          background: 'rgba(240, 248, 255, 0.6)',
          color: '#352f36'
        }}
      >
        <DrawerHeader />
        <ToastCmp />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Home;