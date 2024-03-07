// import fonts
import './fonts/Fonts';

// react related
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';

// css
import './App.css';

// pages
import Notfound from './pages/Notfound';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import InventoryControl from './pages/InventoryControl';
import Products from './pages/InventoryControl/Products';
import Supplier from './pages/Supplier';
import PurchaseOrder from './pages/PurchaseOrder';
import UserAccounts from './pages/UserAccounts';
import Profile from './pages/Profile';
import UpdateProfile from './pages/Profile/UpdateProfile';
import ChangePassword from './pages/Profile/ChangePassword';
import ProductDelivery from './pages/DeliveryHub';
import ItemDelivery from './pages/Delivery Hub/ItemDelivery';
import Customers from './pages/Delivery Hub/Customers';
import DeliveryPersons from './pages/Delivery Hub/DeliveryPersons';

// components
import Footer from './components/Footer';
import store from './redux/store';

function AppTheme({ children }) {
	// use redux to prevent app from reloading after change theme
	// const appTheme = useSelector(state => state.change_app_theme.app_theme);
  
	// pallete mode --> light mode or dark mode
	const theme = createTheme({
	  palette: {
		mode: 'light'
	  },
	  // over ride typography of material-ui
	  typography: {
		fontFamily: 'Source Sans Pro, Quicksand, Lato, Grandstander, sans-serif',
	  },
	  overrides: {
		MuiCssBaseline: {
		  '@global': {
			html: {
			  fontFamily: 'Source Sans Pro, Quicksand, Lato, Grandstander, sans-serif',
			},
			body: {
			  fontFamily: 'Source Sans Pro, Quicksand, Lato, Grandstander, sans-serif',
			},
		  },
		},
	  },
	  // override the navigation drawer of material-ui
	  components: {
		MuiDrawer: {
		  styleOverrides: {
			paper: {
			  backgroundColor: localStorage.getItem('theme') === 'dark' ? '#232323' : '#fefefe', // replace with your desired dark mode color
			},
		  },
		},
	  },
	});
  
	// add css class name on body when dark mode is enabled
	const body = document.querySelector('body');
	if (theme.palette.mode === 'dark') {
	  body.classList.add('darkmode');
	} else {
	  body.classList.remove('darkmode');
	}
  
	return (
	  <ThemeProvider theme={theme}>
		{children}
	  </ThemeProvider>
	);
  }
  

function App() {
	useEffect(() => {
		const expirationTime = parseInt(localStorage.getItem('expire_at'), 10);
		if (!isNaN(expirationTime)) {
			// Calculate the current time in milliseconds
			const now = new Date().getTime();
			
			// Calculate the remaining time until expiration
			const expiresIn = expirationTime - now;
			
			// Convert expiresIn to minutes
			const expiresInMinutes = Math.ceil(expiresIn / (60 * 1000)); // 60,000 milliseconds in a minute
			console.log(`Access token will expires in ${expiresInMinutes} minutes`);
			
			if (expiresIn <= 0) {
				// Access token has expired, do something
				console.log('Access token has expired');
				window.localStorage.clear();
				window.location = "/";
			} else {
				// Access token is still valid, set a timer to check again later
				setTimeout(() => {
					console.log('Checking access token expiration time again');
				}, expiresIn);
			}
		} else {
			// No access token found in local storage
			console.log('Logged out');
		}
	}, []);
	
	return (
		<Provider store={store}>
			<Router>
				<AppTheme>
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/main/page" element={<Home />} >
							<Route path="products" element={<InventoryControl />} />
								{/* child path of the inventory control module */}
								<Route path="products/products-list" element={<Products />} />
							<Route path="suppliers" element={<Supplier />} />
							<Route path="purchase-orders" element={<PurchaseOrder />} />
							<Route path="user-accounts" element={<UserAccounts />} />
							<Route path="profile" element={<Profile />} />
								{/* child path of the profile */}
								<Route path="profile/update-profile" element={<UpdateProfile />} />
								<Route path="profile/change-password" element={<ChangePassword />} />
							<Route path="product-delivery" element={<ProductDelivery />} />
								{/* child path of the Delivery Hub */}
								<Route path="product-delivery/delivery-items" element={<ItemDelivery />} />
								<Route path="product-delivery/customers" element={<Customers />} />
								<Route path="product-delivery/delivery-persons" element={<DeliveryPersons />} />
						</Route>
						<Route path="*" element={<Notfound />}/>
					</Routes>
					<Footer />
				</AppTheme>
			</Router>
		</Provider>
		
	);
}

export default App;