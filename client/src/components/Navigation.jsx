import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
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
import { Tooltip, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import MaterialUISwitch from './ThemeSwitch';
import axios from 'axios';
import { AES, enc } from 'crypto-js';
import { axios_get_header } from '../request/apiRequests';

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
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(isMobile ? false : true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [navigation, setNavigation] = React.useState([]);
  const { access_token } = localStorage;
  let decrypted_access_token;

  if (access_token !== null && access_token !== undefined) {
    decrypted_access_token = AES.decrypt(access_token, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
  } else {
    localStorage.clear();
    window.location = "/";
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = () => {
    axios({
      headers: { Authorization: 'Bearer ' + decrypted_access_token },
      method: "POST",
      url: process.env.REACT_APP_API_BASE_URL + '/user/logout'
    })
    .then(response => {
      alert(response.data.message);
      window.localStorage.clear();
      window.location = "/";
    })
  }

  const get_navigations = () => {
    const { role_id } = localStorage;
    if (role_id !== null) {
      const decrypted_role_id = AES.decrypt(role_id, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);
      const decrypted_auth_id = AES.decrypt(role_id, process.env.REACT_APP_SECRET_KEY).toString(enc.Utf8);

      axios_get_header('/user_nav/get_navigations/' + decrypted_role_id + '/' + decrypted_auth_id, decrypted_access_token)
      .then(response => { setNavigation(response.data.navigations); })
      .catch(error => { console.error("Error: ", error); })
    } else {
      localStorage.clear();
      window.location = "/";
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
    setSelectedIndex(index);
    localStorage.setItem('selectedIndex', index);
  };

  return (
    <div>
        {/* <CssBaseline /> */}
      <AppBar position="fixed" open={open}>
        <Toolbar variant={ isMobile ? 'regular' : 'dense' }>
          <IconButton
            size="small"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: isMobile ? 3 : 5,
              marginLeft: -.9,
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
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose} size="small" style={{ marginBottom: '15px' }}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon fontSize="small"/>}
          </IconButton>
        </DrawerHeader>
        <List>
        <div>
            <Divider sx={{ mx: open ? 2 : 0, mb: open ? 1.5 : (isMobile ? 2.5 : .8), mt: open ? .5 : 0 }}>
            </Divider>
          </div>
        {navigation.map(function(navlist, index) {
          const IconComponent = Muii[navlist.navigation_icon];
          return (
            <ListItem
              key={navlist.navigation_name}
              disablePadding
              sx={{ display: 'block', color: 'inherit', my: 1 }}
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
                  px: 2.5,
                }}
              >
                {open ? (
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      ml: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {<IconComponent fontSize="small" />}
                  </ListItemIcon>
                ) : (
                  <Tooltip title={navlist.navigation_name} arrow placement="right">
                    <ListItemIcon sx={{ minWidth: 0 }}>
                      {IconComponent && <IconComponent fontSize="small" />}
                    </ListItemIcon>
                  </Tooltip>
                )}
                <ListItemText primary={navlist.navigation_name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      </Drawer>
    </div>
  );
}
