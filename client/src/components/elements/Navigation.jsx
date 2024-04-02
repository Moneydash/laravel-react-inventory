import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as Muii from '@mui/icons-material';
import { Box, Tooltip, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import MaterialUISwitch from './ThemeSwitch';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import { axios_get_header } from 'utils/requests';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { closeDrawer, openDrawer } from '../../redux/components/drawer/drawerActions';
import Cookies from 'js-cookie';
import { get_Navs, logOut } from 'utils/services';

const drawerWidth = 330;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  marginBottom: "-25px",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, ismobile }) => ({
  zIndex: ismobile === "true" ? theme.zIndex.drawer : theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: ismobile === "true" ? 0 : drawerWidth,
    width: ismobile === "true" ? '100%' : `calc(100% - ${drawerWidth}px)`,
    transition: ismobile === "true" ? '' : theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, hover }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
    ...(hover && {
      '&:hover': {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
    })
  }),
);

export default function Navigation() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const is_mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = useSelector(state => state.toggleDrawer.drawer);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [navigation, setNavigation] = React.useState([]);
  const access_token = Cookies.get('access_token');
  let decrypted_access_token;

  if (access_token !== null && access_token !== undefined) {
    decrypted_access_token = AES.decrypt(access_token, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
  } else {
    localStorage.clear();
    navigate("/");
  }

  const handleDrawerOpen = () => {
    dispatch(openDrawer());
    localStorage.setItem('drawer', true);
  };

  const handleDrawerClose = () => {
    dispatch(closeDrawer());
    localStorage.setItem('drawer', false);
  };

  const logout = () => {
    axios({
      headers: { Authorization: 'Bearer ' + decrypted_access_token },
      method: "POST",
      url: logOut
    })
    .then(response => {
      // toast and clear the localStorage
      toast.success(response.data.message);
      localStorage.clear();
      
      // clear all the cookies
      const cookies = Cookies.get();
      for (const cookieName in cookies) {
        if (Object.prototype.hasOwnProperty.call(cookies, cookieName)) {
          Cookies.remove(cookieName);
        }
      }

      // timeout before going to the login page
      setTimeout(() => {
        navigate("/");
      }, 2000);
    })
    .catch(error => {
      console.error('Error: ', error);
    });
  }

  const get_navigations = () => {
    const role_id = Cookies.get('role_id');
    const auth_id = Cookies.get('auth_id');
    if (role_id !== undefined) {
      if (role_id !== null) {
        const decrypted_role_id = AES.decrypt(role_id, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
        const decrypted_auth_id = AES.decrypt(auth_id, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
  
        axios_get_header(get_Navs + decrypted_role_id + '/' + decrypted_auth_id, decrypted_access_token)
        .then(response => { setNavigation(response.data.navigations); })
        .catch(error => { console.error("Error: ", error); })
      } else {
        localStorage.clear();
        navigate("/");
      }
    }
  }

  /* eslint-disable */
  React.useEffect(() => {
    get_navigations();
    const storedIndex = localStorage.getItem('selectedIndex');
    if (storedIndex !== null) {
      setSelectedIndex(parseInt(storedIndex));
    }
  }, []);
  /* eslint-disable */

  const handleListItemSelected = (event, index) => {
    const { selectedIndex: previousIndex } = localStorage;
    localStorage.setItem('previousIndex', previousIndex);
    setSelectedIndex(index);
    localStorage.setItem('selectedIndex', index);
  };

  return (
    <div>
        {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open} ismobile={is_mobile.toString()}>
        <Toolbar variant="dense">
          <IconButton
            size="small"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: is_mobile ? 3 : 5,
              marginLeft: is_mobile ? -.4 :-.9,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            InventoryIQ
          </Typography>
          <Tooltip title="Logout User" placement="bottom" arrow>
            <IconButton
                size="small"
                color="inherit"
                sx={{ mx: 1 }}
                onClick={logout}
            >
                <Muii.LogoutOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title='Light Mode' placement="bottom" arrow>
            <MaterialUISwitch />
          </Tooltip>
        </Toolbar>
      </AppBar>
      { is_mobile ? (
        <MuiDrawer open={open} onClose={handleDrawerClose} variant="temporary" sx={{ overflow: 'hidden' }}>
          <Box sx={{ width: 300, overflow: 'hidden' }} role="presentation">
            <List sx={{ overflow: 'hidden' }}>
              {navigation.map(function(navlist, index) {
                const IconComponent = Muii[navlist.navigation_icon];
                return (
                  <ListItem
                    key={navlist.navigation_name}
                    disablePadding
                    sx={{ display: 'block', color: 'inherit', my: .5, overflow: 'hidden' }}
                    to={navlist.navigation_url}
                    component={Link}
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemSelected(event, index)}
                    className={selectedIndex === index ? 'selected' : ''}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        pl: is_mobile ? 2.5 : 3,
                      }}
                    >
                      {open ? (
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3.5 : 'auto',
                            ml: open ? 1 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          {<IconComponent fontSize="small" />}
                        </ListItemIcon>
                      ) : (
                        <Tooltip title={navlist.navigation_name} arrow placement="right">
                          <ListItemIcon sx={{ minWidth: 0 }}>
                            {IconComponent && <IconComponent fontSize="inherit" />}
                          </ListItemIcon>
                        </Tooltip>
                      )}
                      <ListItemText primaryTypographyProps={{ fontSize: 15, fontWeight: 'medium', lineHeight: '20px' }} primary={navlist.navigation_name} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </MuiDrawer>
      ) : (<Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} size="small" style={{ marginBottom: '15px' }}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon fontSize="small"/>}
          </IconButton>
        </DrawerHeader>
        <List sx={{ ml: open ? 1.5 : .5, mr: open ? 1.5 : .5 }}>
          <div>
              <Divider sx={{ mx: 0, mb: open ? 1.5 : (is_mobile ? 2.5 : .8), mt: open ? .5 : 0 }}>
              </Divider>
            </div>
          {navigation.map(function(navlist, index) {
            const IconComponent = Muii[navlist.navigation_icon];
            return (
              <ListItem
                key={navlist.navigation_name}
                disablePadding
                sx={{ color: 'inherit', my: .5, borderRadius: 3 }}
                to={navlist.navigation_url}
                component={Link}
                selected={selectedIndex === index}
                onClick={(event) => handleListItemSelected(event, index)}
                className={selectedIndex === index ? 'selectedListItem' : ''}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    pl: is_mobile ? 2.5 : 3,
                    borderRadius: 3
                  }}
                >
                  {open ? (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3.5 : 'auto',
                        ml: open ? 1 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {<IconComponent fontSize="small" />}
                    </ListItemIcon>
                  ) : (
                    <Tooltip title={navlist.navigation_name} arrow placement="right">
                      <ListItemIcon sx={{ minWidth: 0, mr: open ? 0 : 1.2 }}>
                        {IconComponent && <IconComponent fontSize="inherit" />}
                      </ListItemIcon>
                    </Tooltip>
                  )}
                  <ListItemText primaryTypographyProps={{ fontSize: 15, fontWeight: 'medium', lineHeight: '20px' }} primary={navlist.navigation_name} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>)}
    </div>
  );
}
