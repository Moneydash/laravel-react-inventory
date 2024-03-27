import React, { Fragment, forwardRef, useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid'
import { AppBar, Button, Card, CardContent, Container, Dialog, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Slide, Snackbar, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { AddShoppingCartOutlined, CloseRounded, EditRounded, InfoOutlined, KeyboardArrowDownRounded, RefreshOutlined } from "@mui/icons-material";
import { axios_get_header, axios_post_header, axios_put_header } from "../../utils/requests";
import { LoadingButton } from "@mui/lab";
import { decryptAccessToken } from "utils/auth";
import {
    get_Purchase_orders,
    generate_Po,
    get_Purchase_order,
    update_Purchase_order,
    add_Purchase_order,
    get_Suppliers,
    get_Supplier_products
} from 'utils/services';

const transitionStyle = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PurchaseOrder() {
    document.title = 'InventoryIQ: Purchase Order';
    const decrypted_access_token = decryptAccessToken(); // decrypt access token

    // temporarily hard coded, but will add on the app configurations later.
    const billing_addr = 'East Rembo, Makati City';
    const shipping_addr = 'Comembo, Makati City';

    const renderActionButtons = (params) => {
        return <div>
                <IconButton onClick={() => get_purchase_order(params.value, 2)} color="primary">
                    <Tooltip title="View Product Information" placement="bottom" arrow><InfoOutlined fontSize="small"/></Tooltip>
                </IconButton>
                <IconButton onClick={() => get_purchase_order(params.value, 1)} color="primary" sx={{ ml: 1 }}>
                    <Tooltip title="Update Product Information" placement="bottom" arrow><EditRounded fontSize="small"/></Tooltip>
                </IconButton>
        </div>
    }

    const columns = [
        { field: 'po_number', headerName: 'PO Number', flex: 1 },
        { field: 'supplier_id', headerName: 'Supplier Name', flex: 1 },
        { field: 'product_id', headerName: 'Product Name', flex: 1 },
        { field: 'quantity', headerName: 'Quantity', flex: 1 },
        { field: 'unit_price', headerName: 'Unit Price', flex: 1 },
        { field: 'subtotal', headerName: 'SubTotal', flex: 1 },
        { field: 'date_of_order', headerName: 'Order Date', flex: 1 },
        { field: 'id', headerName: 'Actions', flex: 1, renderCell: renderActionButtons }
    ];
    const [rows, setRows] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [editIndex, setEditIndex] = useState(0); // 0 = add, 1 = edit, 2 = view
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [productPrice, setProductPrice] = useState('');
    const [loadingTable, setLoadingTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fullDisable, setFullDisable] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    // forms
    const [formData, setFormData] = useState({
        po_number: '',
        supplier_id: '',
        billing_address: billing_addr,
        shipping_address: shipping_addr,
        product_id: '',
        quantity: 1,
        unit_price: 0,
        subtotal: 0,
        purchase_order_notes: '',
        delivery_notes: '',
        order_status: 0
    });
    const [formDataError, setFormDataError] = useState({
        supplier_id: false,
        product_id: false,
        quantity: false,
        unit_price: false
    });
    const [formDataHelpertext, setFormDataHelperText] = useState({
        quantity: '',
        unit_price: '',
    });

    const get_purchase_orders = () => {
        setRows([]);
        setLoadingTable(true);
        axios_get_header(get_Purchase_orders, decrypted_access_token)
        .then(response => {
            const data = response.data.purchase_order_data;
            const transformedData = data.map(purchase_order => {
                const date = new Date(purchase_order["date_of_order"]);
                // Extract the date components
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
                const day = date.getDate().toString().padStart(2, '0');

                // Extract the time components
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                // Create the formatted date string in "yyyy-mm-dd HH:mm:ss" format
                const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                const supplierName = purchase_order.suppliers.supp_name;
                const productName = purchase_order.products.prod_name;

                return {
                    id: purchase_order['po_number'],
                    po_number: purchase_order['po_number'],
                    supplier_id: supplierName,
                    product_id: productName,
                    quantity: purchase_order['quantity'],
                    unit_price: purchase_order['unit_price'],
                    subtotal: parseFloat(purchase_order['subtotal']).toFixed(2),
                    date_of_order: formattedDate
                }
            });
            setLoadingTable(false);
            setRows(transformedData);
        })
        .catch(error => {
            setLoading(false);
            console.log(error);
        });
    }

    /* eslint-disable */
    useEffect(() => {
        get_purchase_orders();
    }, []);
    /* eslint-disable */

    const generate_po_number = () => {
        axios_get_header(generate_Po, decrypted_access_token)
        .then(response => { setFormData((prevState) => ({ ...prevState, po_number: response.data.po_number })); })
        .catch(error => { console.log(error); });
    }

    const get_suppliers = () => {
        axios_get_header(get_Suppliers, decrypted_access_token)
        .then(response => { setSuppliers(response.data.suppliers); })
        .catch(error => { console.log(error); });
    }

    const get_supplier_products = (supplier_id) => {
        axios_get_header(get_Supplier_products + supplier_id, decrypted_access_token)
        .then(response => { setProducts(response.data.supplier_products); })
        .catch(error => { console.log(error); });
    }

    const formDataReset = () => {
        setFormData((prevState) => ({
            ...prevState,
            po_number: '',
            supplier_id: '',
            billing_address: billing_addr,
            shipping_address: shipping_addr,
            product_id: '',
            quantity: 0,
            unit_price: 0,
            subtotal: 0,
            purchase_order_notes: '',
            delivery_notes: '',
            order_status: 0
        }));
        setProducts([]);
        setProductPrice('');
        setFullDisable(false);
        setEditIndex(0);
    }

    const handleDialog = (status) => {
        if (formData.po_number === null || formData.po_number === '') {
            generate_po_number();
        }
        get_suppliers();
        setDialog(status);
        if (status === false) {
            formDataReset();
        }
    }

    const get_purchase_order = (param, status) => {
        setEditIndex(status);

        get_suppliers();
        axios_get_header(get_Purchase_order + param, decrypted_access_token)
        .then(response => {
            const data = response.data.purchase_order_data;
            get_supplier_products(data.supplier_id);
            setFullDisable(data.order_status === 2 ? true : false);
            setFormData((prevState) => ({
                ...prevState,
                po_number: data.po_number,
                supplier_id: data.supplier_id,
                billing_address: data.billing_address,
                shipping_address: data.shipping_address,
                product_id: data.product_id,
                quantity: data.quantity,
                unit_price: data.unit_price,
                subtotal: data.subtotal,
                purchase_order_notes: data.purchase_order_notes,
                delivery_notes: data.delivery_notes === null ? '' : data.delivery_notes,
                order_status: data.order_status
            }));
            setDialog(true);
        })
        .catch(error => { console.log(error); });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'supplier_id') {
            setFormData((prevState) => ({ ...prevState, [name]: value, product_id: '' }));

            if (value !== '') {
                get_supplier_products(value);
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
            }
        }

        if (name === 'product_id') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            const selected_product = products.find((product) => product.id === value);

            if (value !== '') {
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                if (selected_product) {
                    setProductPrice(selected_product.prod_price);
                }
            }
        }

        if (name === 'unit_price') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            const modifiedString = name.replace(/_/, ' ');

            const isValidNumber = /^[1-9]\d*(\.\d+)?$/;

            if (isValidNumber.test(value)) {
                const numericValue = parseFloat(value);

                if (numericValue === '' || numericValue <= 0) {
                    setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1) + ' must not be empty or zero value!' }));
                } else if (numericValue >= productPrice) {
                    setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1) + ' must be less than the price of the chosen product' }));
                } else {
                    if (formData.quantity !== null && formData.quantity > 0) {
                        setFormData((prevState) => ({ ...prevState, subtotal: parseFloat(value * formData.quantity).toFixed(2) }));
                    }
                    setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                    setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
                }
            } else {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: modifiedString.charAt(0).toUpperCase() + modifiedString.slice(1) + ' must be a number' }));
            }
        }

        if (name === 'quantity') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
            const isValidNumber = /^[1-9]\d*(\.\d+)?$/.test(value);

            if (value === '' || !isValidNumber) {
                setFormDataError((prevError) => ({ ...prevError, [name]: true }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: name.charAt(0).toUpperCase() + name.slice(1) + ' must not be empty, equals or less than to zero' }));
            } else {
                setFormData((prevState) => ({ ...prevState, subtotal: parseFloat(formData.unit_price * value).toFixed(2) }));
                setFormDataError((prevError) => ({ ...prevError, [name]: false }));
                setFormDataHelperText((prevText) => ({ ...prevText, [name]: '' }));
            }
        }

        if (name === 'purchase_order_notes' || name === 'delivery_notes') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }

        if (name === 'order_status') {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }
    }
    
    const handleSnackbar = (status, message) => { setSnackbar((prevSnack) => ({ ...prevSnack, open: status, message: message })); }
    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;

        for (const field in formDataError) {
            if (formData[field] === true) {
                hasError = true;
            }
        }

        if (formData.supplier_id === '') {
            setFormDataError((prevError) => ({ ...prevError, supplier_id: true }));
            handleSnackbar(true, 'Supplier field must not be empty!');
        } else if (formData.product_id === '') {
            setFormDataError((prevError) => ({ ...prevError, product_id: true }));
            handleSnackbar(true, 'Product field must not be empty!');
        } else if (hasError) {
            handleSnackbar(true, 'Check for empty or error fields!');
        } else {
            setLoading(true);
            if (editIndex === 1) {
                axios_put_header(update_Purchase_order + formData.po_number, formData, decrypted_access_token)
                .then(() => {
                    setLoading(false);
                    setDialog(false);
                    formDataReset();
                    get_purchase_order();
                })
                .catch(error => { console.log(error); });
            } else {
                axios_post_header(add_Purchase_order, formData, decrypted_access_token)
                .then(() => {
                    setLoading(false);
                    setDialog(false);
                    formDataReset();
                    get_purchase_orders();
                })
                .catch(error => { console.log(error); });
            }
        }
    }

    // close button on snackbar
    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="cancel"
                color="inherit"
                onClick={() => handleSnackbar(false, '')}
            >
                <CloseRounded fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (
        <Grid container justifyContent="flex-start" alignItems="center" sx={{ px: 2, mt: 5 }}>
            <Snackbar open={snackbar.open} onClose={() => handleSnackbar(false, '')} message={snackbar.message} autoHideDuration={3000} action={action} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}} />
            <Dialog open={dialog} fullScreen TransitionComponent={transitionStyle}>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => handleDialog(false)} aria-label="close">
                            <KeyboardArrowDownRounded fontSize="small"/>
                        </IconButton>
                        <Typography variant="body2" sx={{ ml: 2, flex: 1 }} component="div">
                            { editIndex === 0 ? 'Add New' : (editIndex === 1 ? 'Update' : 'View') } Purchase Order { editIndex === 1 || editIndex === 2 ? 'Information' : '' }
                        </Typography>
                        { editIndex === 2 || fullDisable ? '' : (loading ? <LoadingButton loading loadingPosition="end" endIcon={<RefreshOutlined />}>{ editIndex === 0 ? 'Purchasing ...' : 'Submitting...' }</LoadingButton> : <Button color="inherit" onClick={handleSubmit}>
                            { editIndex === 0 ? 'Purchase Now' : 'Submit Order' }
                        </Button>) }
                    </Toolbar>
                </AppBar>
                <Container>
                    <Grid container direction="row" columnSpacing={{ lg: 3, xl: 3 }} rowSpacing={3} sx={{ mt: 7 }}>
                        <Grid item xl={6} lg={6}>
                            <Grid container direction="column" justifyContent="center" rowSpacing={3}>
                                <Grid item>
                                    <TextField variant="outlined" label="PO Number" name="po_number" value={formData.po_number} disabled fullWidth />
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <InputLabel id="supplier_id">Suppliers</InputLabel>
                                        <Select
                                            labelId="supplier_id"
                                            id="supplier_id"
                                            label="Supplier"
                                            name="supplier_id"
                                            fullWidth
                                            value={formData.supplier_id}
                                            onChange={handleChange}
                                            error={formDataError.supplier_id}
                                            disabled={ editIndex === 2 || fullDisable }
                                        >
                                            { suppliers.map(supplier => (
                                                <MenuItem key={supplier.id} value={supplier.id}>
                                                    { supplier.supp_name }
                                                </MenuItem>
                                            )) }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        { products.length > 0 || editIndex === 0 ? <InputLabel id="product_id">Products</InputLabel> : '' }
                                        {editIndex === 0 ? (
                                            <Select
                                                labelId="product_id"
                                                id="parent_id"
                                                label="Products"
                                                name="product_id"
                                                fullWidth
                                                value={formData.product_id}
                                                onChange={handleChange}
                                            >
                                                {products.map(product => (
                                                    <MenuItem key={product.id} value={product.id}>
                                                        {product.prod_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        ) : (
                                            products.length > 0 ? (
                                                <Select
                                                    labelId="product_id"
                                                    id="parent_id"
                                                    label="Products"
                                                    name="product_id"
                                                    fullWidth
                                                    value={formData.product_id}
                                                    onChange={handleChange}
                                                    disabled={ editIndex === 2 || fullDisable }
                                                >
                                                    {products.map(product => (
                                                        <MenuItem key={product.id} value={product.id}>
                                                            {product.prod_name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <p>Loading products...</p>
                                            )
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        variant="outlined"
                                        label="Unit Price"
                                        name="unit_price"
                                        value={formData.unit_price}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
                                        }}
                                        onChange={handleChange}
                                        error={formDataError.unit_price}
                                        helperText={formDataHelpertext.unit_price}
                                        fullWidth
                                        disabled={formData.supplier_id === '' || formData.product_id === '' || editIndex === 2 || fullDisable}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        variant="outlined"
                                        label="Quantity"
                                        name="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        error={formDataError.quantity}
                                        helperText={formDataHelpertext.quantity}
                                        fullWidth
                                        InputProps={{ inputProps: { min: 1 } }}
                                        disabled={formData.supplier_id === '' || formData.product_id === '' || editIndex === 2 || fullDisable}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={6} xl={6}>
                            <Grid container direction="column" justifyContent="center" rowSpacing={3}>
                                <Grid item>
                                    <TextField variant="outlined" label="Purchase Order notes" name="purchase_order_notes" value={formData.purchase_order_notes} onChange={handleChange} disabled={editIndex === 2 || fullDisable} fullWidth/>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Subtotal" name="subtotal" value={formData.subtotal} onChange={handleChange} disabled={ editIndex === 2 || fullDisable } fullWidth/>
                                </Grid>
                                <Grid item>
                                    <FormControl fullWidth>
                                        <InputLabel id="order_status">Order Status</InputLabel>
                                        <Select
                                            labelId="order_status"
                                            id="order_status"
                                            label="Order Status"
                                            name="order_status"
                                            fullWidth
                                            value={formData.order_status}
                                            onChange={handleChange}
                                            disabled={ editIndex === 2 || fullDisable }
                                        >
                                            <MenuItem value={0}>Open</MenuItem>
                                            <MenuItem value={1}>Pending</MenuItem>
                                            {editIndex === 0 ? '' : <MenuItem value={2}>Close</MenuItem>}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Billing Address" name="billing_address" value={formData.billing_address} disabled fullWidth />
                                </Grid>
                                <Grid item>
                                    <TextField variant="outlined" label="Shipping Address" name="shipping_addr" value={formData.shipping_address} disabled fullWidth />
                                </Grid>
                            </Grid>
                        </Grid>
                        { editIndex === 1 || editIndex === 2 ? (
                            <Grid item lg={12} xl={12}>
                                <TextField multiline variant="outlined" rows={4} label="Delivery Notes" name="delivery_notes" disabled={ fullDisable } value={formData.delivery_notes} onChange={handleChange} fullWidth />
                            </Grid>
                        ) : '' }
                    </Grid>
                </Container>
            </Dialog>
            <Grid container justifyContent="flex-end" alignItems="center" columnSpacing={{ lg: 1, xl: 1 }}>
                <Grid item>
                    <Button variant="contained" endIcon={<RefreshOutlined />} onClick={get_purchase_orders}>Refresh Table</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" endIcon={<AddShoppingCartOutlined />} onClick={() => handleDialog(true)}>Add Purhase Order</Button>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-start" alignItems="center" sx={{ mt: 2 }}>
                <Grid item lg={12} xl={12}>
                    <Card raised sx={{ width: '100%' }}>
                        <CardContent>
                            <DataGrid rows={rows} columns={columns} loading={loadingTable} autoHeight/>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default PurchaseOrder;