import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastCmp = () => {

    return (
        <ToastContainer
            position="bottom-left"
            autoClose={6000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme={ localStorage.getItem('theme') === 'dark' ? 'light' : 'dark' }
        />
    );
}

export default ToastCmp;