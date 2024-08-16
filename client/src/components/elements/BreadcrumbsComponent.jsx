/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { NavigateNextOutlined } from '@mui/icons-material';


function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/">{children}</StaticRouter>;
  }

  return <MemoryRouter>{children}</MemoryRouter>;
}

Router.propTypes = {
  children: PropTypes.node,
};

const BreadCrumbsCmp = ({ data }) => {
    return (
        <div style={{ marginLeft: '3px' }}>
            <Breadcrumbs separator={<NavigateNextOutlined fontSize="small" />} aria-label="breadcrumbs">
                {data.map((item, index) => (
                    <Link
                        component={RouterLink}
                        key={index}
                        underline={item.link === '' ? 'hover' : 'none'}
                        color="inherit"
                        to={item.link}
                        disabled={item.link ? true : false}
                    >
                        <Typography variant="body1" sx={{ fontWeight: '600' }}>{item.text}</Typography>
                    </Link>
                ))}
            </Breadcrumbs>
        </div>
    );
}

export default BreadCrumbsCmp;