import { Typography } from '@mui/material';
import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <Typography variant="body2">&copy; {new Date().getFullYear()} InventoryIQ</Typography>
    </footer>
  );
}

export default Footer;