import { styled } from '@mui/material/styles';
import { Switch } from '@mui/material';

const ThemeSwitch = styled(Switch)(({ theme }) => ({
    width: 55,
    height: 28,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: localStorage.getItem('theme') === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: localStorage.getItem('theme') === 'dark' ? '#003892' : '#353e2c',
      width: 25,
      height: 25,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="%23fff" stroke="none"><path d="M1719 4922 c-307 -123 -565 -290 -803 -522 -473 -460 -728 -1032 -753 -1690 -19 -512 123 -1016 407 -1443 788 -1187 2405 -1464 3545 -608 114 86 318 280 410 391 164 198 304 436 400 680 51 132 43 194 -36 253 -46 33 -94 32 -219 -6 -226 -68 -417 -97 -652 -97 -409 0 -802 115 -1153 338 -243 155 -490 402 -647 647 -348 546 -432 1205 -233 1834 30 94 29 147 -2 190 -60 79 -127 88 -264 33z"/></g></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: localStorage.getItem('theme') === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

export default ThemeSwitch;