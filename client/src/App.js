// import fonts
import './fonts/js/Fonts';

// react related
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import appRoutes from './routes';

// css
import './App.css';

// components
import Footer from './components/elements/Footer';
import store from 'store/store';

function AppTheme({ children }) {
	// use redux to prevent app from reloading after change theme
	// const appTheme = useSelector(state => state.change_app_theme.app_theme);
  
	// pallete mode --> light mode or dark mode
	const theme = createTheme({
	  palette: {
		mode: 'light',
		background: {
			'default': 'rgba(240, 248, 255, 0.6)' // Alice Blue for light mode background
		}
	  },
	  // over ride typography of material-ui
	  typography: {
		fontFamily: 'Source Sans Pro, Quicksand, Lato, Grandstander, sans-serif',
		color: '#352f36'
	  },
	  overrides: {
		MuiCssBaseline: {
		  '@global': {
			html: {
			  fontFamily: 'Source Sans Pro, Quicksand, Lato, Grandstander, sans-serif',
			  background: 'rgba(240, 248, 255, 0.6)',
			  color: '#352f36'
			},
			body: {
			  fontFamily: 'Source Sans Pro, Quicksand, Lato, Grandstander, sans-serif',
			  background: 'rgba(240, 248, 255, 0.6)',
			  color: '#352f36'
			},
		  },
		},
	  },
	  // override the navigation drawer of material-ui
	  components: {
		MuiDrawer: {
		  styleOverrides: {
			paper: {
			  backgroundColor: localStorage.getItem('theme') === 'dark' ? '#232323' : 'rgba(240, 248, 255, 1)', // replace with your desired dark mode color,
			  color: localStorage.getItem('theme') === 'dark' ? '#fff' : '#352f36'
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
	const router = createBrowserRouter(appRoutes);
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
			<AppTheme>
				<RouterProvider router={router} />
				<Footer />
			</AppTheme>
		</Provider>
		
	);
}

export default App;